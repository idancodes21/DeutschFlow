import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const lessons = [
  {
    title: "Greetings & Introductions",
    description: "Learn how to greet people and introduce yourself in German.",
    level: 1,
    order: 1,
    isPublished: true,
  },
  {
    title: "Numbers & Age",
    description: "Learn German numbers and how to talk about your age.",
    level: 1,
    order: 2,
    isPublished: true,
  },
  {
    title: "Family & People",
    description: "Learn vocabulary for talking about your family and people.",
    level: 1,
    order: 3,
    isPublished: true,
  },
  {
    title: "Daily Activities",
    description: "Learn useful German vocabulary for everyday activities.",
    level: 1,
    order: 4,
    isPublished: true,
  },
  {
    title: "Food & Drinks",
    description: "Learn how to talk about food, drinks, and what you like.",
    level: 1,
    order: 5,
    isPublished: true,
  },
];

async function main() {
  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        id: `a1-lesson-${lesson.order}`,
      },
      update: lesson,
      create: {
        id: `a1-lesson-${lesson.order}`,
        ...lesson,
      },
    });
  }

  console.log("A1 lessons seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
