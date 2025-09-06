// src/controllers/studentController.js
import { getCandidates, getStatusForUser, castVote } from "../services/electionServices.js";

export async function listCandidates(req, res) {
  try {
    const election = await getCandidates((await require("../services/electionServices.js").getActiveElection())._id);
    res.json(election);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function status(req, res) {
  try {
    const { userId } = req.params;
    const status = await getStatusForUser(userId);
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function vote(req, res) {
  try {
    const { userId, candidateId } = req.body || {};
    await castVote(userId, candidateId, null);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
