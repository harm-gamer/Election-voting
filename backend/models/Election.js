// src/models/Election.js
import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  branch: { type: String, required: true }, // 5-char branch code
  totalVoters: { type: Number, required: true },
  numberOfCandidates: { type: Number, required: true },
  status: { type: String, enum: ["active","closed"], default: "active" },
}, { timestamps: true });

export default mongoose.model("Election", ElectionSchema);

