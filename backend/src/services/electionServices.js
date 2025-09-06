// src/services/electionService.js
import mongoose from "mongoose";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";
import BannedRoll from "../models/BannedRoll.js";
import AuditLog from "../models/AuditLog.js";
import { extractRollNo, isValidUserIdForElection } from "../utils/validator.js";

/**
 * Create a new election and candidates
 */
export async function initiateElection({ year, branch, totalVoters, candidateNames, actorId = null }) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const election = await Election.create([{
      year, branch, totalVoters, numberOfCandidates: candidateNames.length, status: "active"
    }], { session });
    const elect = election[0];
    const candidates = candidateNames.map((name, idx) => ({
      election: elect._id,
      cid: idx+1,
      name,
      votes: 0
    }));
    await Candidate.insertMany(candidates, { session });
    await AuditLog.create([{ action: "initiate_election", actorId, details: { electionId: elect._id }, timestamp: new Date() }], { session });
    await session.commitTransaction();
    return elect;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Get current active election (assumes one active)
 */
export async function getActiveElection() {
  return Election.findOne({ status: "active" }).lean();
}

/**
 * Get candidates for an election
 */
export async function getCandidates(electionId) {
  return Candidate.find({ election: electionId }).select("-__v -createdAt -updatedAt").lean();
}

/**
 * Check status of a user (valid, banned, voted)
 */
export async function getStatusForUser(userId) {
  const election = await getActiveElection();
  if (!election) return { valid: false, banned: false, voted: false, message: "No active election" };
  const valid = isValidUserIdForElection(userId, election);
  if (!valid) return { valid: false, banned: false, voted: false };
  const rollNo = extractRollNo(userId);
  const banned = !!(await BannedRoll.findOne({ election: election._id, rollNo }));
  const voted = !!(await Vote.findOne({ election: election._id, userId, deleted: false }));
  return { valid, banned, voted };
}

/**
 * Cast a vote atomically. Uses transaction if possible.
 */
export async function castVote(userId, candidateCid, actorId = null) {
  const election = await getActiveElection();
  if (!election) throw new Error("No active election");

  if (!isValidUserIdForElection(userId, election)) throw new Error("Invalid userId for this election");

  const rollNo = extractRollNo(userId);

  // Check banned
  const banned = await BannedRoll.findOne({ election: election._id, rollNo });
  if (banned) throw new Error("User is banned");

  // Start transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Ensure not already voted (unique index on Vote helps too)
    const existing = await Vote.findOne({ election: election._id, userId }).session(session);
    if (existing && !existing.deleted) throw new Error("Already voted");

    // Insert vote doc
    await Vote.create([{
      election: election._id,
      userId,
      rollNo,
      candidateCid
    }], { session });

    // Increment candidate counter
    const upd = await Candidate.findOneAndUpdate(
      { election: election._id, cid: candidateCid },
      { $inc: { votes: 1 } },
      { new: true, session }
    );
    if (!upd) throw new Error("Candidate not found");

    await AuditLog.create([{ action: "vote", actorId, details: { userId, candidateCid, electionId: election._id } }], { session });

    await session.commitTransaction();
    return { ok: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Delete illegal vote by userId (soft delete vote + decrement candidate)
 */
export async function deleteIllegalVote(userId, adminId, reason = "") {
  const election = await getActiveElection();
  if (!election) throw new Error("No active election");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const vote = await Vote.findOne({ election: election._id, userId, deleted: false }).session(session);
    if (!vote) throw new Error("No vote to delete");

    vote.deleted = true;
    vote.deletedBy = adminId;
    vote.deletedAt = new Date();
    vote.reason = reason;
    await vote.save({ session });

    // decrement candidate
    const cid = vote.candidateCid;
    await Candidate.findOneAndUpdate({ election: election._id, cid }, { $inc: { votes: -1 } }, { session });

    await AuditLog.create([{ action: "delete_vote", actorId: adminId, details: { userId, electionId: election._id, reason } }], { session });

    await session.commitTransaction();
    return { ok: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Ban array of roll numbers
 */
export async function banRollNumbers(rollNumbers = [], adminId, reason="") {
  const election = await getActiveElection();
  if (!election) throw new Error("No active election");
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const valid = rollNumbers.filter(n => Number.isInteger(n) && n >= 1 && n <= election.totalVoters);
    const ops = valid.map(r => ({
      updateOne: {
        filter: { election: election._id, rollNo: r },
        update: { $setOnInsert: { election: election._id, rollNo: r, reason } },
        upsert: true
      }
    }));
    if (ops.length) await BannedRoll.bulkWrite(ops, { session });
    await AuditLog.create([{ action: "ban", actorId: adminId, details: { rollNumbers: valid } }], { session });
    await session.commitTransaction();
    return { ok: true, banned: valid };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Get aggregated results
 */
export async function getResults() {
  const election = await getActiveElection();
  if (!election) throw new Error("No active election");
  const candidates = await Candidate.find({ election: election._id }).select("cid name votes").lean();
  const totalVoted = candidates.reduce((s, c) => s + (c.votes || 0), 0);
  const votingPercentage = election.totalVoters ? Math.floor((totalVoted * 100) / election.totalVoters) : 0;
  // Determine winner (tie -> null)
  let maxV = -1, winnerCid = null, tie=false;
  for (const c of candidates) {
    if (c.votes > maxV) { maxV = c.votes; winnerCid = c.cid; tie=false; }
    else if (c.votes === maxV) { tie = true; }
  }
  const winner = tie ? null : candidates.find(c => c.cid === winnerCid) || null;
  return { winner, candidates, totalVoted, votingPercentage, meta: election };
}
