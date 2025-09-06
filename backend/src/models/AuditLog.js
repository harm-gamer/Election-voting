// src/models/AuditLog.js
import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., ban, delete_vote, initiate_election, vote
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser", default: null },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", AuditLogSchema);
