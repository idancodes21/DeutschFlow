import { getAuth } from "@clerk/express";
import { Router } from "express";

import { prisma } from "../lib/prisma.js";

const router = Router();

async function getAuthenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  return user?.id ?? null;
}

/**
 * GET /api/practice/overview
 */
router.get("/overview", async (req, res) => {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const [
      completedActivities,
      mistakeActivities,
      dueVocabularyCount,
      recentAttempts,
    ] = await Promise.all([
      prisma.activityProgress.count({
        where: {
          userId,
          completed: true,
          activity: {
            is: {
              isPublished: true,
              type: { not: "INFO" },
            },
          },
        },
      }),

      prisma.activityAttempt.findMany({
        where: {
          userId,
          isCorrect: false,
          activity: {
            is: {
              isPublished: true,
              type: { not: "INFO" },
            },
          },
        },
        distinct: ["activityId"],
        select: { activityId: true },
      }),

      prisma.vocabularyProgress.count({
        where: {
          userId,
          nextReviewAt: { lte: now },
        },
      }),

      prisma.activityAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          isCorrect: true,
          createdAt: true,
          activity: {
            select: {
              id: true,
              title: true,
              section: {
                select: {
                  unit: {
                    select: { title: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    return res.json({
      overview: {
        completedActivities,
        mistakeCount: mistakeActivities.length,
        dueVocabularyCount,
        recentAttempts: recentAttempts.map((attempt) => ({
          isCorrect: attempt.isCorrect,
          createdAt: attempt.createdAt,
          activityId: attempt.activity.id,
          activityTitle: attempt.activity.title,
          unitTitle: attempt.activity.section.unit.title,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to load practice overview:", error);

    return res.status(500).json({
      message: "Failed to load practice overview",
    });
  }
});

/**
 * GET /api/practice/session?mode=review
 * GET /api/practice/session?mode=mistakes
 */
router.get("/session", async (req, res) => {
  try {
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const mode = typeof req.query.mode === "string" ? req.query.mode : "review";

    if (mode !== "review" && mode !== "mistakes") {
      return res.status(400).json({
        message: "Invalid practice mode",
      });
    }

    const activitySelect = {
      id: true,
      type: true,
      order: true,
      title: true,
      prompt: true,
      explanation: true,
      content: true,
      audioUrl: true,
      imageUrl: true,
      xpReward: true,
      section: {
        select: {
          title: true,
          unit: {
            select: { title: true },
          },
        },
      },
    } as const;

    let activities: Array<{
      id: string;
      type: string;
      order: number;
      title: string | null;
      prompt: string | null;
      explanation: string | null;
      content: unknown;
      audioUrl: string | null;
      imageUrl: string | null;
      xpReward: number;
      section: {
        title: string;
        unit: { title: string };
      };
    }> = [];

    if (mode === "review") {
      const records = await prisma.activityProgress.findMany({
        where: {
          userId,
          completed: true,
          activity: {
            is: {
              isPublished: true,
              type: { not: "INFO" },
              section: {
                is: {
                  unit: { isPublished: true },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: {
          activity: {
            select: activitySelect,
          },
        },
      });

      activities = records.map((record) => record.activity);
    } else {
      const attempts = await prisma.activityAttempt.findMany({
        where: {
          userId,
          isCorrect: false,
          activity: {
            is: {
              isPublished: true,
              type: { not: "INFO" },
              section: {
                is: {
                  unit: { isPublished: true },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          activityId: true,
          activity: {
            select: activitySelect,
          },
        },
      });

      const seen = new Set<string>();

      activities = attempts
        .filter((attempt) => {
          if (seen.has(attempt.activityId)) {
            return false;
          }

          seen.add(attempt.activityId);
          return true;
        })
        .slice(0, 10)
        .map((attempt) => attempt.activity);
    }

    return res.json({
      mode,
      activities: activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        order: activity.order,
        title: activity.title,
        prompt: activity.prompt,
        explanation: activity.explanation,
        content: activity.content,
        audioUrl: activity.audioUrl,
        imageUrl: activity.imageUrl,
        xpReward: activity.xpReward,
        sectionTitle: activity.section.title,
        unitTitle: activity.section.unit.title,
      })),
    });
  } catch (error) {
    console.error("Failed to load practice session:", error);

    return res.status(500).json({
      message: "Failed to load practice session",
    });
  }
});

export default router;
