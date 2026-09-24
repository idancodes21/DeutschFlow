import { getAuth } from "@clerk/express";
import { Router } from "express";

import { prisma } from "../lib/prisma.js";

const router = Router();

router.get("/path", async (req, res) => {
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
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const path = await prisma.learningPath.findFirst({
      where: {
        isPublished: true,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        units: {
          where: {
            isPublished: true,
          },
          orderBy: {
            order: "asc",
          },
          include: {
            progress: {
              where: {
                userId: user.id,
              },
              select: {
                progress: true,
                masteryScore: true,
                completed: true,
                startedAt: true,
                completedAt: true,
              },
            },
          },
        },
      },
    });

    if (!path) {
      return res.json({
        path: null,
      });
    }

    let previousUnitCompleted = true;

    const units = path.units.map((unit) => {
      const progress = unit.progress[0] ?? null;

      const completed = progress?.completed ?? false;
      const locked = !previousUnitCompleted;

      const status = completed ? "completed" : locked ? "locked" : "current";

      previousUnitCompleted = completed;

      return {
        id: unit.id,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        cefrLevel: unit.cefrLevel,
        progress: progress?.progress ?? 0,
        masteryScore: progress?.masteryScore ?? 0,
        completed,
        locked,
        status,
        startedAt: progress?.startedAt ?? null,
        completedAt: progress?.completedAt ?? null,
      };
    });

    return res.json({
      path: {
        id: path.id,
        slug: path.slug,
        name: path.name,
        description: path.description,
        units,
      },
    });
  } catch (error) {
    console.error("Failed to get learning path:", error);

    return res.status(500).json({
      message: "Failed to get learning path",
    });
  }
});

router.get("/:id", async (req, res) => {
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
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const unit = await prisma.unit.findFirst({
      where: {
        id: req.params.id,
        isPublished: true,
      },
      include: {
        progress: {
          where: {
            userId: user.id,
          },
          select: {
            progress: true,
            masteryScore: true,
            completed: true,
            startedAt: true,
            completedAt: true,
          },
        },

        sections: {
          orderBy: {
            order: "asc",
          },

          include: {
            progress: {
              where: {
                userId: user.id,
              },
              select: {
                progress: true,
                masteryScore: true,
                completed: true,
                startedAt: true,
                completedAt: true,
              },
            },

            activities: {
              where: {
                isPublished: true,
              },

              orderBy: {
                order: "asc",
              },

              select: {
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
                progress: {
                  where: {
                    userId: user.id,
                  },
                  select: {
                    attempts: true,
                    correctCount: true,
                    wrongCount: true,
                    bestScore: true,
                    masteryScore: true,
                    completed: true,
                    lastAttemptAt: true,
                    completedAt: true,
                  },
                },
              },
            },
          },
        },

        vocabularyLinks: {
          orderBy: {
            order: "asc",
          },

          include: {
            vocabulary: true,
          },
        },

        grammarLinks: {
          orderBy: {
            order: "asc",
          },

          include: {
            grammar: true,
          },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }

    const unitProgress = unit.progress[0] ?? null;

    const sections = unit.sections.map((section) => {
      const sectionProgress = section.progress[0] ?? null;

      return {
        id: section.id,
        type: section.type,
        title: section.title,
        description: section.description,
        order: section.order,

        progress: sectionProgress,

        activities: section.activities.map((activity) => ({
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

          progress: activity.progress[0] ?? null,
        })),
      };
    });

    return res.json({
      unit: {
        id: unit.id,
        title: unit.title,
        description: unit.description,
        order: unit.order,
        cefrLevel: unit.cefrLevel,

        progress: unitProgress,

        sections,

        vocabulary: unit.vocabularyLinks.map((link) => ({
          order: link.order,
          isCore: link.isCore,
          ...link.vocabulary,
        })),

        grammar: unit.grammarLinks.map((link) => ({
          order: link.order,
          isCore: link.isCore,
          ...link.grammar,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to get unit:", error);

    return res.status(500).json({
      message: "Failed to get unit",
    });
  }
});

export default router;
