-- CreateEnum
CREATE TYPE "CefrLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('EXPLAINER', 'PATTERN_DRILLS', 'GUIDED_SENTENCE', 'RECALL', 'MIXED_REVIEW', 'LISTENING');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('INFO', 'MULTIPLE_CHOICE', 'FILL_BLANK', 'CONJUGATION', 'SENTENCE_BUILDER', 'MATCH', 'WORD_ORDER', 'LISTENING_CHOICE');

-- AlterTable
ALTER TABLE "LearningProgress" ADD COLUMN     "unitsCompleted" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "cefrLevel" "CefrLevel",
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitSection" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "prompt" TEXT,
    "explanation" TEXT,
    "content" JSONB NOT NULL,
    "solution" JSONB,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "masteryScore" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "masteryScore" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "masteryScore" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastAttemptAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "response" JSONB,
    "isCorrect" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitVocabulary" (
    "unitId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isCore" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UnitVocabulary_pkey" PRIMARY KEY ("unitId","vocabularyId")
);

-- CreateTable
CREATE TABLE "UnitGrammar" (
    "unitId" TEXT NOT NULL,
    "grammarId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isCore" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UnitGrammar_pkey" PRIMARY KEY ("unitId","grammarId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE INDEX "LearningPath_isPublished_idx" ON "LearningPath"("isPublished");

-- CreateIndex
CREATE INDEX "Unit_pathId_idx" ON "Unit"("pathId");

-- CreateIndex
CREATE INDEX "Unit_cefrLevel_idx" ON "Unit"("cefrLevel");

-- CreateIndex
CREATE INDEX "Unit_isPublished_idx" ON "Unit"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_pathId_order_key" ON "Unit"("pathId", "order");

-- CreateIndex
CREATE INDEX "UnitSection_unitId_idx" ON "UnitSection"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitSection_unitId_order_key" ON "UnitSection"("unitId", "order");

-- CreateIndex
CREATE INDEX "Activity_sectionId_idx" ON "Activity"("sectionId");

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_isPublished_idx" ON "Activity"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_sectionId_order_key" ON "Activity"("sectionId", "order");

-- CreateIndex
CREATE INDEX "UnitProgress_userId_idx" ON "UnitProgress"("userId");

-- CreateIndex
CREATE INDEX "UnitProgress_unitId_idx" ON "UnitProgress"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitProgress_userId_unitId_key" ON "UnitProgress"("userId", "unitId");

-- CreateIndex
CREATE INDEX "SectionProgress_userId_idx" ON "SectionProgress"("userId");

-- CreateIndex
CREATE INDEX "SectionProgress_sectionId_idx" ON "SectionProgress"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "SectionProgress_userId_sectionId_key" ON "SectionProgress"("userId", "sectionId");

-- CreateIndex
CREATE INDEX "ActivityProgress_userId_idx" ON "ActivityProgress"("userId");

-- CreateIndex
CREATE INDEX "ActivityProgress_activityId_idx" ON "ActivityProgress"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityProgress_userId_activityId_key" ON "ActivityProgress"("userId", "activityId");

-- CreateIndex
CREATE INDEX "ActivityAttempt_userId_idx" ON "ActivityAttempt"("userId");

-- CreateIndex
CREATE INDEX "ActivityAttempt_activityId_idx" ON "ActivityAttempt"("activityId");

-- CreateIndex
CREATE INDEX "ActivityAttempt_userId_activityId_createdAt_idx" ON "ActivityAttempt"("userId", "activityId", "createdAt");

-- CreateIndex
CREATE INDEX "UnitVocabulary_vocabularyId_idx" ON "UnitVocabulary"("vocabularyId");

-- CreateIndex
CREATE INDEX "UnitGrammar_grammarId_idx" ON "UnitGrammar"("grammarId");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitSection" ADD CONSTRAINT "UnitSection_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "UnitSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitProgress" ADD CONSTRAINT "UnitProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitProgress" ADD CONSTRAINT "UnitProgress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionProgress" ADD CONSTRAINT "SectionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionProgress" ADD CONSTRAINT "SectionProgress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "UnitSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityProgress" ADD CONSTRAINT "ActivityProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityProgress" ADD CONSTRAINT "ActivityProgress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitVocabulary" ADD CONSTRAINT "UnitVocabulary_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitVocabulary" ADD CONSTRAINT "UnitVocabulary_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGrammar" ADD CONSTRAINT "UnitGrammar_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitGrammar" ADD CONSTRAINT "UnitGrammar_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "Grammar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
