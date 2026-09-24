import { getAuth } from "@clerk/express";
import { Router } from "express";
import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";

const router = Router();

function normalizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value !== null && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return Object.keys(object)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = normalizeValue(object[key]);
        return result;
      }, {});
  }

  return value;
}

function extractExpectedAnswer(
  solution: Prisma.JsonValue | null,
): Prisma.JsonValue | null {
  if (solution === null) {
    return null;
  }

  if (typeof solution !== "object" || Array.isArray(solution)) {
    return solution;
  }

  const object = solution as Record<string, Prisma.JsonValue>;

  if ("answer" in object) {
    return object.answer;
  }

  if ("correctOrder" in object) {
    return object.correctOrder;
  }

  if ("answers" in object) {
    return object.answers;
  }

  return solution;
}

function answersMatch(response: unknown, expected: Prisma.JsonValue | null) {
  return (
    JSON.stringify(normalizeValue(response)) ===
    JSON.stringify(normalizeValue(expected))
  );
}

router.post("/:id/attempt", async (req, res) => {
  try {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const activityId = req.params.id;
    const response = req.body?.response;

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

    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        isPublished: true,
      },
      include: {
        section: {
          include: {
            unit: true,
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    if (activity.type !== "INFO" && response === undefined) {
      return res.status(400).json({
        message: "Response is required",
      });
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const existingActivityProgress = await tx.activityProgress.findUnique({
        where: {
          userId_activityId: {
            userId: user.id,
            activityId: activity.id,
          },
        },
      });

      const expectedAnswer = extractExpectedAnswer(activity.solution);

      const isCorrect =
        activity.type === "INFO"
          ? true
          : answersMatch(response, expectedAnswer);

      const score = isCorrect ? 100 : 0;

      const wasAlreadyCompleted = existingActivityProgress?.completed ?? false;

      const newlyCompleted = isCorrect && !wasAlreadyCompleted;

      const xpEarned = newlyCompleted ? activity.xpReward : 0;

      await tx.activityAttempt.create({
        data: {
          userId: user.id,
          activityId: activity.id,
          response:
            response === undefined
              ? Prisma.DbNull
              : (response as Prisma.InputJsonValue),
          isCorrect,
          score,
        },
      });

      const updatedActivityProgress = await tx.activityProgress.upsert({
        where: {
          userId_activityId: {
            userId: user.id,
            activityId: activity.id,
          },
        },
        update: {
          attempts: {
            increment: 1,
          },

          correctCount: {
            increment: isCorrect ? 1 : 0,
          },

          wrongCount: {
            increment: isCorrect ? 0 : 1,
          },

          bestScore: {
            set: Math.max(existingActivityProgress?.bestScore ?? 0, score),
          },

          masteryScore: {
            set: isCorrect
              ? 100
              : (existingActivityProgress?.masteryScore ?? 0),
          },

          completed: existingActivityProgress?.completed || isCorrect,

          lastAttemptAt: now,

          completedAt:
            existingActivityProgress?.completedAt ?? (isCorrect ? now : null),
        },

        create: {
          userId: user.id,
          activityId: activity.id,
          attempts: 1,
          correctCount: isCorrect ? 1 : 0,
          wrongCount: isCorrect ? 0 : 1,
          bestScore: score,
          masteryScore: isCorrect ? 100 : 0,
          completed: isCorrect,
          lastAttemptAt: now,
          completedAt: isCorrect ? now : null,
        },
      });

      const sectionActivities = await tx.activity.findMany({
        where: {
          sectionId: activity.sectionId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });

      const sectionActivityIds = sectionActivities.map((item) => item.id);

      const sectionProgressRecords = await tx.activityProgress.findMany({
        where: {
          userId: user.id,
          activityId: {
            in: sectionActivityIds,
          },
        },
        select: {
          completed: true,
        },
      });

      const completedSectionActivities = sectionProgressRecords.filter(
        (item) => item.completed,
      ).length;

      const sectionTotal = sectionActivities.length;

      const sectionProgress =
        sectionTotal === 0
          ? 0
          : Math.round((completedSectionActivities / sectionTotal) * 100);

      const existingSectionProgress = await tx.sectionProgress.findUnique({
        where: {
          userId_sectionId: {
            userId: user.id,
            sectionId: activity.sectionId,
          },
        },
      });

      const sectionCompleted =
        sectionTotal > 0 && completedSectionActivities === sectionTotal;

      const newlyCompletedSection =
        sectionCompleted && !(existingSectionProgress?.completed ?? false);

      const updatedSectionProgress = await tx.sectionProgress.upsert({
        where: {
          userId_sectionId: {
            userId: user.id,
            sectionId: activity.sectionId,
          },
        },
        update: {
          progress: sectionProgress,

          masteryScore: sectionProgress,

          completed: sectionCompleted,

          startedAt: existingSectionProgress?.startedAt ?? now,

          completedAt:
            existingSectionProgress?.completedAt ??
            (sectionCompleted ? now : null),
        },
        create: {
          userId: user.id,
          sectionId: activity.sectionId,
          progress: sectionProgress,
          masteryScore: sectionProgress,
          completed: sectionCompleted,
          startedAt: now,
          completedAt: sectionCompleted ? now : null,
        },
      });

      const unitActivities = await tx.activity.findMany({
        where: {
          isPublished: true,
          section: {
            unitId: activity.section.unitId,
          },
        },
        select: {
          id: true,
        },
      });

      const unitActivityIds = unitActivities.map((item) => item.id);

      const unitProgressRecords = await tx.activityProgress.findMany({
        where: {
          userId: user.id,
          activityId: {
            in: unitActivityIds,
          },
        },
        select: {
          completed: true,
        },
      });

      const completedUnitActivities = unitProgressRecords.filter(
        (item) => item.completed,
      ).length;

      const unitTotal = unitActivities.length;

      const unitProgress =
        unitTotal === 0
          ? 0
          : Math.round((completedUnitActivities / unitTotal) * 100);

      const existingUnitProgress = await tx.unitProgress.findUnique({
        where: {
          userId_unitId: {
            userId: user.id,
            unitId: activity.section.unitId,
          },
        },
      });

      const unitCompleted =
        unitTotal > 0 && completedUnitActivities === unitTotal;

      const newlyCompletedUnit =
        unitCompleted && !(existingUnitProgress?.completed ?? false);

      const updatedUnitProgress = await tx.unitProgress.upsert({
        where: {
          userId_unitId: {
            userId: user.id,
            unitId: activity.section.unitId,
          },
        },
        update: {
          progress: unitProgress,
          masteryScore: unitProgress,
          completed: unitCompleted,

          startedAt: existingUnitProgress?.startedAt ?? now,

          completedAt:
            existingUnitProgress?.completedAt ?? (unitCompleted ? now : null),
        },
        create: {
          userId: user.id,
          unitId: activity.section.unitId,
          progress: unitProgress,
          masteryScore: unitProgress,
          completed: unitCompleted,
          startedAt: now,
          completedAt: unitCompleted ? now : null,
        },
      });

      await tx.learningProgress.upsert({
        where: {
          userId: user.id,
        },
        update: {
          xp: {
            increment: xpEarned,
          },

          unitsCompleted: {
            increment: newlyCompletedUnit ? 1 : 0,
          },

          lastActivityAt: now,
        },
        create: {
          userId: user.id,
          xp: xpEarned,
          unitsCompleted: newlyCompletedUnit ? 1 : 0,
          lastActivityAt: now,
        },
      });

      return {
        activityProgress: updatedActivityProgress,
        sectionProgress: updatedSectionProgress,
        unitProgress: updatedUnitProgress,
        isCorrect,
        score,
        xpEarned,
        newlyCompleted,
        newlyCompletedSection,
        newlyCompletedUnit,
      };
    });

    return res.json({
      result: {
        isCorrect: result.isCorrect,
        score: result.score,
        xpEarned: result.xpEarned,

        activityCompleted: result.activityProgress.completed,

        sectionCompleted: result.sectionProgress.completed,

        unitCompleted: result.unitProgress.completed,

        progress: {
          activity: result.activityProgress,
          section: result.sectionProgress,
          unit: result.unitProgress,
        },
      },
    });
  } catch (error) {
    console.error("Failed to submit activity:", error);

    return res.status(500).json({
      message: "Failed to submit activity",
    });
  }
});

export default router;
