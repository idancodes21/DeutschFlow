import { getAuth } from "@clerk/express";
import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const { userId } = getAuth(req);

    res.json({
      clerkId: userId,
    });
  } catch (error) {
    console.error("Failed to get current user:", error);

    res.status(500).json({
      message: "Failed to get current user",
    });
  }
});

export default router;
