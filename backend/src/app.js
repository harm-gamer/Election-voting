// src/app.js
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import publicRoutes from "./routes/public.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

// health
app.get("/api/health", (_, res) => res.json({ ok: true }));

export default app;
