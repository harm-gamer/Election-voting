// src/models/Vote.js
import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  userId: { type: String, required: true }, // full 14-char PRN
  rollNo: { type: Number, required: true },
  candidateCid: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", default: null },
  deletedAt: { type: Date, default: null },
  reason: { type: String, default: "" }
}, { timestamps: true });

VoteSchema.index({ election: 1, userId: 1 }, { unique: true });

export default mongoose.model("Vote", VoteSchema);
