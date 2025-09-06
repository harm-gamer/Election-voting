// src/routes/public.js
import express from "express";
import * as studentCtrl from "../controllers/studentController.js";
const router = express.Router();

router.get("/candidates", async (req, res) => {
  // Get candidates of active election
  try {
    const svc = await import("../services/electionService.js");
    const election = await svc.getActiveElection();
    if (!election) return res.json([]);
    const c = await svc.getCandidates(election._id);
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/status/:userId", studentCtrl.status);
router.post("/vote", studentCtrl.vote);

export default router;
