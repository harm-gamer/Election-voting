// src/models/BannedRoll.js
import mongoose from "mongoose";

const BannedRollSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  rollNo: { type: Number, required: true },
  reason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

BannedRollSchema.index({ election: 1, rollNo: 1 }, { unique: true });

export default mongoose.model("BannedRoll", BannedRollSchema);
