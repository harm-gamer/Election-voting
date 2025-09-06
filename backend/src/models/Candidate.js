// src/models/Candidate.js
import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  cid: { type: Number, required: true }, // 1..N
  name: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

CandidateSchema.index({ election: 1, cid: 1 }, { unique: true });

export default mongoose.model("Candidate", CandidateSchema);

