import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import activitiesRouter from "./routes/activities.js";
import healthRouter from "./routes/health.js";
import lessonsRouter from "./routes/lessons.js";
import unitsRouter from "./routes/units.js";
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
app.use("/api/lessons", lessonsRouter);
app.use("/api/units", unitsRouter);
app.use("/api/activities", activitiesRouter);

app.listen(PORT, () => {
  console.log(`DeutschFlow API running on port ${PORT}`);
});
