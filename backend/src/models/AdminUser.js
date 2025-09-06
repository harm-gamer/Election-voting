// src/models/AdminUser.js
import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // store hashed password (bcrypt)
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AdminUser", AdminUserSchema);
