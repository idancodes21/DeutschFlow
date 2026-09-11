import { getAuth } from "@clerk/express";
import { Router } from "express";

import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        {
          level: "asc",
        },
        {
          order: "asc",
        },
      ],
    });

    return res.json({
      lessons,
    });
  } catch (error) {
    console.error("Failed to get lessons:", error);

    return res.status(500).json({
      message: "Failed to get lessons",
    });
  }
});

router.get("/continue", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const nextLesson = await prisma.lesson.findFirst({
      where: {
        isPublished: true,
        progress: {
          none: {
            userId: user.id,
            completed: true,
          },
        },
      },
      orderBy: [
        {
          level: "asc",
        },
        {
          order: "asc",
        },
      ],
      include: {
        progress: {
          where: {
            userId: user.id,
          },
          select: {
            progress: true,
            completed: true,
            startedAt: true,
            completedAt: true,
          },
        },
      },
    });

    if (!nextLesson) {
      return res.json({
        lesson: null,
      });
    }

    const lessonProgress = nextLesson.progress[0] ?? null;

    return res.json({
      lesson: {
        id: nextLesson.id,
        title: nextLesson.title,
        description: nextLesson.description,
        level: nextLesson.level,
        order: nextLesson.order,
        progress: lessonProgress?.progress ?? 0,
        completed: lessonProgress?.completed ?? false,
        startedAt: lessonProgress?.startedAt ?? null,
        completedAt: lessonProgress?.completedAt ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to get continue lesson:", error);

    return res.status(500).json({
      message: "Failed to get continue lesson",
    });
  }
});

export default router;
