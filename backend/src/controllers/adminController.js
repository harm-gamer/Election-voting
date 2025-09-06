// src/controllers/adminController.js
import { initiateElection, getResults, deleteIllegalVote, banRollNumbers } from "../services/electionServices.js";
import AdminUser from "../models/AdminUser.js";
import bcrypt from "bcrypt";

// Basic login (you can replace with JWT)
export async function login(req, res) {
  const { username, password } = req.body || {};
  // For quick start: allow the default Admin if not present
  let admin = await AdminUser.findOne({ username });
  if (!admin) {
    // create default Admin/admiN on first request - only in dev! remove in production
    const hash = await bcrypt.hash("admiN", 10);
    admin = await AdminUser.create({ username: "Admin", passwordHash: hash });
  }
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  // Skip JWT: return ok. In production, return a token.
  return res.json({ ok: true, adminId: admin._id });
}

// Initiate election
export async function initiate(req, res) {
  try {
    const { year, branch, totalVoters, candidates } = req.body || {};
    const actorId = req.body.actorId || null;
    const elect = await initiateElection({ year, branch, totalVoters, candidateNames: candidates, actorId });
    res.json({ ok: true, election: elect });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function results(req, res) {
  try {
    const r = await getResults();
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteVote(req, res) {
  try {
    const { userId, adminId, reason } = req.body || {};
    await deleteIllegalVote(userId, adminId || null, reason || "");
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function ban(req, res) {
  try {
    const { rollNumbers, adminId, reason } = req.body || {};
    const r = await banRollNumbers(rollNumbers, adminId || null, reason || "");
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
