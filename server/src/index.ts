import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
import usersRouter from "./routes/users.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

app.get("/", (_req, res) => {
  res.json({
    message: "DeutschFlow API is running 🚀",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`DeutschFlow API running on port ${PORT}`);
});
