import { clerkClient, getAuth } from "@clerk/express";
import { Router } from "express";

import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(400).json({
        message: "No email address found for Clerk user",
      });
    }

    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        profile: true,
        learningProgress: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,

          profile: {
            create: {
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
            },
          },

          learningProgress: {
            create: {},
          },
        },

        include: {
          profile: true,
          learningProgress: true,
        },
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Failed to get current user:", error);

    return res.status(500).json({
      message: "Failed to get current user",
    });
  }
});

export default router;
