// src/server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const MONGO = process.env.MONGODB_URI || "mongodb://localhost:27017/electiondb";
const PORT = process.env.PORT || 3001;

async function start() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Mongo connected");
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
