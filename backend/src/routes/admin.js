// src/routes/admin.js
import express from "express";
import * as adminCtrl from "../controllers/adminController.js";
const router = express.Router();

router.post("/login", adminCtrl.login);
router.post("/initiate", adminCtrl.initiate);
router.post("/continue", async (req, res) => { res.json({ ok: true }); }); // handled by service layer if needed
router.post("/delete-vote", adminCtrl.deleteVote);
router.post("/ban", adminCtrl.ban);
router.get("/results", adminCtrl.results);

export default router;
