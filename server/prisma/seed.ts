import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";

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

const unit1Sections = [
  {
    id: "unit-1-explainer",
    type: "EXPLAINER" as const,
    title: "See the pattern",
    description:
      "A 2-minute look at why German feels different — and the one rule that explains most of it.",
    order: 1,
  },
  {
    id: "unit-1-pattern-drills",
    type: "PATTERN_DRILLS" as const,
    title: "Try the pattern",
    description:
      "Quick, low-pressure reps on the rule alone — no full sentences yet.",
    order: 2,
  },
  {
    id: "unit-1-guided-sentence",
    type: "GUIDED_SENTENCE" as const,
    title: "Build a sentence",
    description:
      "Put the pattern to work with the words right there to guide you.",
    order: 3,
  },
  {
    id: "unit-1-recall",
    type: "RECALL" as const,
    title: "Do it from memory",
    description:
      "Same pattern, hints removed. This is where it starts to stick.",
    order: 4,
  },
  {
    id: "unit-1-mixed-review",
    type: "MIXED_REVIEW" as const,
    title: "Mix it up",
    description: "Combine everything from this unit in one round.",
    order: 5,
  },
  {
    id: "unit-1-listening",
    type: "LISTENING" as const,
    title: "Hear it",
    description:
      "Match the spoken German to what you've already learned to read.",
    order: 6,
  },
];

const unit1Activities = [
  {
    id: "unit1-exp-0",
    sectionId: "unit-1-explainer",
    type: "INFO" as const,
    order: 1,
    title: "Before we start",
    prompt:
      "German has a reputation for being hard. Here's why that's mostly a myth.",
    explanation:
      "German isn't random — it's one of the most rule-based languages you can learn. Once you see a pattern, it repeats everywhere. That's the whole idea behind this course: pattern first, sentences second, speaking third.",
    content: {
      type: "hook",
      animation: "bounce-in",
      illustration: "🇩🇪",
      audioText: "Willkommen! Let's learn German, one pattern at a time.",
      body: "You won't be thrown into full sentences today. You'll learn two small, reliable patterns and practice just those — nothing else.",
    },
    solution: null,
    xpReward: 2,
  },

  {
    id: "unit1-exp-1",
    sectionId: "unit-1-explainer",
    type: "INFO" as const,
    order: 2,
    title: "German has patterns",
    prompt:
      "The goal is not to memorize every sentence. Learn the pattern behind the sentence.",
    explanation:
      "German becomes easier when you notice recurring patterns. We will first understand a pattern, then practice it, and only later remove the hints.",
    content: {
      type: "explanation",
      animation: "fade-up",
      audioText: "Ich lerne Deutsch. I am learning German.",
      body: "This course teaches German from the pattern outward: understand the rule, practice the pattern, use it in sentences, recall it, then hear it.",
      example: {
        german: "Ich lerne Deutsch.",
        english: "I am learning German.",
      },
    },
    solution: null,
    xpReward: 2,
  },

  {
    id: "unit1-exp-2",
    sectionId: "unit-1-explainer",
    type: "INFO" as const,
    order: 3,
    title: "German nouns are capitalized",
    prompt: "Notice the capital letter in important German nouns.",
    explanation:
      "In German, nouns are written with a capital letter — every noun, not just names. This is one of the easiest patterns to spot, and it instantly helps you find the 'things' in a sentence when reading.",
    content: {
      type: "explanation",
      animation: "highlight-caps",
      audioText: "Das Buch ist neu. Ich lerne Deutsch.",
      examples: [
        {
          german: "Das Buch ist neu.",
          english: "The book is new.",
        },
        {
          german: "Ich lerne Deutsch.",
          english: "I am learning German.",
        },
      ],
      rule: "Nouns begin with a capital letter.",
    },
    solution: null,
    xpReward: 2,
  },

  {
    id: "unit1-exp-3",
    sectionId: "unit-1-explainer",
    type: "INFO" as const,
    order: 4,
    title: "The verb usually comes second",
    prompt: "Look at the position of the verb in a simple statement.",
    explanation:
      "In a normal German statement, the conjugated verb almost always sits in the second position — even if something other than the subject starts the sentence. This one rule will explain a lot of German word order later on.",
    content: {
      type: "explanation",
      animation: "slide-swap",
      audioText: "Ich lerne Deutsch. Heute lerne ich Deutsch.",
      examples: [
        {
          german: "Ich lerne Deutsch.",
          breakdown: ["Ich", "lerne", "Deutsch"],
        },
        {
          german: "Heute lerne ich Deutsch.",
          breakdown: ["Heute", "lerne", "ich", "Deutsch"],
        },
      ],
      rule: "The conjugated verb stays in the second position even when another element comes first.",
    },
    solution: null,
    xpReward: 2,
  },

  {
    id: "unit1-drill-1",
    sectionId: "unit-1-pattern-drills",
    type: "MULTIPLE_CHOICE" as const,
    order: 1,
    title: "Capitalization",
    prompt: "Which sentence uses German capitalization correctly?",
    explanation: "German nouns begin with a capital letter.",
    content: {
      animation: "pop-correct",
      options: ["Das buch ist neu.", "Das Buch ist neu.", "Das buch ist Neu."],
    },
    solution: {
      answer: "Das Buch ist neu.",
    },
    xpReward: 5,
  },

  {
    id: "unit1-drill-2",
    sectionId: "unit-1-pattern-drills",
    type: "MULTIPLE_CHOICE" as const,
    order: 2,
    title: "Verb position",
    prompt: "Which sentence follows the normal German statement pattern?",
    explanation: "The conjugated verb comes in the second position.",
    content: {
      animation: "pop-correct",
      options: [
        "Ich Deutsch lerne.",
        "Ich lerne Deutsch.",
        "Lerne ich Deutsch.",
      ],
    },
    solution: {
      answer: "Ich lerne Deutsch.",
    },
    xpReward: 5,
  },

  {
    id: "unit1-drill-3",
    sectionId: "unit-1-pattern-drills",
    type: "FILL_BLANK" as const,
    order: 3,
    title: "Complete the verb",
    prompt: "Ich ___ Deutsch.",
    explanation: "The subject 'ich' uses the first-person singular verb form.",
    content: {
      animation: "pop-correct",
      wordBank: ["lerne", "lernst", "lernen"],
    },
    solution: {
      answer: "lerne",
    },
    xpReward: 5,
  },

  {
    id: "unit1-guided-1",
    sectionId: "unit-1-guided-sentence",
    type: "SENTENCE_BUILDER" as const,
    order: 1,
    title: "Build the sentence",
    prompt: "Build the sentence: I am learning German.",
    explanation:
      "Start with the subject, then place the conjugated verb in the second position.",
    content: {
      animation: "tile-drop",
      wordBank: ["Ich", "lerne", "Deutsch", "."],
      hint: "Subject → verb → rest of sentence",
      translation: "I am learning German.",
    },
    solution: {
      correctOrder: ["Ich", "lerne", "Deutsch", "."],
    },
    xpReward: 5,
  },

  {
    id: "unit1-guided-2",
    sectionId: "unit-1-guided-sentence",
    type: "SENTENCE_BUILDER" as const,
    order: 2,
    title: "Move the time expression",
    prompt: "Build the sentence: Today I am learning German.",
    explanation:
      "Even when another element comes first, the conjugated verb remains in the second position.",
    content: {
      animation: "tile-drop",
      wordBank: ["Heute", "lerne", "ich", "Deutsch", "."],
      hint: "Time → verb → subject → rest",
      translation: "Today I am learning German.",
    },
    solution: {
      correctOrder: ["Heute", "lerne", "ich", "Deutsch", "."],
    },
    xpReward: 5,
  },

  {
    id: "unit1-recall-1",
    sectionId: "unit-1-recall",
    type: "FILL_BLANK" as const,
    order: 1,
    title: "Recall the verb",
    prompt: "Heute ___ ich Deutsch.",
    explanation: null,
    content: {
      animation: "pop-correct",
    },
    solution: {
      answer: "lerne",
    },
    xpReward: 7,
  },

  {
    id: "unit1-recall-2",
    sectionId: "unit-1-recall",
    type: "FILL_BLANK" as const,
    order: 2,
    title: "Recall the verb",
    prompt: "Ich ___ in Lagos.",
    explanation: null,
    content: {
      animation: "pop-correct",
    },
    solution: {
      answer: "wohne",
    },
    xpReward: 7,
  },

  {
    id: "unit1-mixed-1",
    sectionId: "unit-1-mixed-review",
    type: "MULTIPLE_CHOICE" as const,
    order: 1,
    title: "Mix the patterns",
    prompt: "Which sentence is correct?",
    explanation: "Check both the noun capitalization and the verb position.",
    content: {
      animation: "pop-correct",
      options: [
        "Ich lerne deutsch.",
        "Ich lerne Deutsch.",
        "Ich Deutsch lerne.",
      ],
    },
    solution: {
      answer: "Ich lerne Deutsch.",
    },
    xpReward: 7,
  },

  {
    id: "unit1-mixed-2",
    sectionId: "unit-1-mixed-review",
    type: "SENTENCE_BUILDER" as const,
    order: 2,
    title: "Mixed sentence",
    prompt: "Build the correct sentence.",
    explanation: "Use the verb-second pattern and keep the noun capitalized.",
    content: {
      animation: "tile-drop",
      wordBank: ["Heute", "lerne", "ich", "Deutsch", "."],
      translation: "Today I am learning German.",
    },
    solution: {
      correctOrder: ["Heute", "lerne", "ich", "Deutsch", "."],
    },
    xpReward: 7,
  },

  {
    id: "unit1-listen-1",
    sectionId: "unit-1-listening",
    type: "LISTENING_CHOICE" as const,
    order: 1,
    title: "Listen and recognize",
    prompt: "Listen carefully. Which sentence did you hear?",
    explanation:
      "You already learned this written pattern. Now connect the written form to its spoken form.",
    content: {
      animation: "waveform",
      audioText: "Ich lerne Deutsch.",
      options: [
        "Ich lerne Deutsch.",
        "Ich lerne Englisch.",
        "Heute lerne ich Deutsch.",
      ],
    },
    solution: {
      answer: "Ich lerne Deutsch.",
    },
    xpReward: 10,
  },

  {
    id: "unit1-listen-2",
    sectionId: "unit-1-listening",
    type: "LISTENING_CHOICE" as const,
    order: 2,
    title: "Listen for word order",
    prompt: "Listen and choose the sentence you hear.",
    explanation: "Notice the verb position even when 'Heute' comes first.",
    content: {
      animation: "waveform",
      audioText: "Heute lerne ich Deutsch.",
      options: [
        "Heute lerne ich Deutsch.",
        "Heute ich lerne Deutsch.",
        "Ich lerne heute Deutsch.",
      ],
    },
    solution: {
      answer: "Heute lerne ich Deutsch.",
    },
    xpReward: 10,
  },

  {
    id: "unit1-complete-1",
    sectionId: "unit-1-listening",
    type: "INFO" as const,
    order: 3,
    title: "Unit complete",
    prompt: "You've finished your first unit.",
    explanation:
      "Two patterns down: capitalized nouns, and verb-second word order. Both will show up in almost every unit from here on.",
    content: {
      type: "completion",
      animation: "confetti",
      illustration: "🎉",
      audioText: "Super gemacht! Well done.",
      body: "Next up: numbers — so you can count, tell time, and talk about prices right away.",
    },
    solution: null,
    xpReward: 5,
  },
];

const unit1Vocabulary = [
  {
    id: "unit1-vocab-deutsch",
    german: "Deutsch",
    english: "German",
    article: null,
    plural: null,
    example: "Ich lerne Deutsch.",
    level: 1,
    category: "language",
  },
  {
    id: "unit1-vocab-lernen",
    german: "lernen",
    english: "to learn",
    article: null,
    plural: null,
    example: "Ich lerne Deutsch.",
    level: 1,
    category: "verbs",
  },
  {
    id: "unit1-vocab-heute",
    german: "heute",
    english: "today",
    article: null,
    plural: null,
    example: "Heute lerne ich Deutsch.",
    level: 1,
    category: "time",
  },
  {
    id: "unit1-vocab-wohnen",
    german: "wohnen",
    english: "to live",
    article: null,
    plural: null,
    example: "Ich wohne in Lagos.",
    level: 1,
    category: "verbs",
  },
];

const unit1Grammar = [
  {
    id: "unit1-grammar-capitalization",
    title: "German noun capitalization",
    explanation:
      "German nouns begin with a capital letter. This makes nouns easier to recognize in written German.",
    example: "Das Buch ist neu.",
    level: 1,
    category: "orthography",
  },
  {
    id: "unit1-grammar-verb-second",
    title: "Verb-second word order",
    explanation:
      "In a normal German statement, the conjugated verb usually comes in the second position.",
    example: "Heute lerne ich Deutsch.",
    level: 1,
    category: "word-order",
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

  const learningPath = await prisma.learningPath.upsert({
    where: {
      slug: "german-foundations",
    },
    update: {
      name: "German Foundations",
      description:
        "Build a strong foundation in German grammar and sentence patterns.",
      order: 1,
      isPublished: true,
    },
    create: {
      id: "german-foundations",
      slug: "german-foundations",
      name: "German Foundations",
      description:
        "Build a strong foundation in German grammar and sentence patterns.",
      order: 1,
      isPublished: true,
    },
  });

  const unit1 = await prisma.unit.upsert({
    where: {
      id: "unit-1",
    },
    update: {
      pathId: learningPath.id,
      title: "What's different in German?",
      description:
        "Learn the basic patterns that make German different and predictable.",
      order: 1,
      cefrLevel: "A1",
      isPublished: true,
    },
    create: {
      id: "unit-1",
      pathId: learningPath.id,
      title: "What's different in German?",
      description:
        "Learn the basic patterns that make German different and predictable.",
      order: 1,
      cefrLevel: "A1",
      isPublished: true,
    },
  });

  for (const section of unit1Sections) {
    await prisma.unitSection.upsert({
      where: {
        id: section.id,
      },
      update: {
        unitId: unit1.id,
        type: section.type,
        title: section.title,
        description: section.description,
        order: section.order,
      },
      create: {
        id: section.id,
        unitId: unit1.id,
        type: section.type,
        title: section.title,
        description: section.description,
        order: section.order,
      },
    });
  }

  await prisma.activity.updateMany({
    where: {
      sectionId: { in: unit1Sections.map((section) => section.id) },
    },
    data: {
      order: { increment: 1000 },
    },
  });

  for (const activity of unit1Activities) {
    await prisma.activity.upsert({
      where: {
        id: activity.id,
      },
      update: {
        sectionId: activity.sectionId,
        type: activity.type,
        order: activity.order,
        title: activity.title,
        prompt: activity.prompt,
        explanation: activity.explanation,
        content: activity.content,
        solution:
          activity.solution === null ? Prisma.DbNull : activity.solution,
        xpReward: activity.xpReward,
        isPublished: true,
      },
      create: {
        id: activity.id,
        sectionId: activity.sectionId,
        type: activity.type,
        order: activity.order,
        title: activity.title,
        prompt: activity.prompt,
        explanation: activity.explanation,
        content: activity.content,
        solution:
          activity.solution === null ? Prisma.DbNull : activity.solution,
        xpReward: activity.xpReward,
        isPublished: true,
      },
    });
  }

  for (const [index, vocabulary] of unit1Vocabulary.entries()) {
    await prisma.vocabulary.upsert({
      where: {
        id: vocabulary.id,
      },
      update: vocabulary,
      create: vocabulary,
    });

    await prisma.unitVocabulary.upsert({
      where: {
        unitId_vocabularyId: {
          unitId: unit1.id,
          vocabularyId: vocabulary.id,
        },
      },
      update: {
        order: index + 1,
        isCore: true,
      },
      create: {
        unitId: unit1.id,
        vocabularyId: vocabulary.id,
        order: index + 1,
        isCore: true,
      },
    });
  }

  for (const [index, grammar] of unit1Grammar.entries()) {
    await prisma.grammar.upsert({
      where: {
        id: grammar.id,
      },
      update: grammar,
      create: grammar,
    });

    await prisma.unitGrammar.upsert({
      where: {
        unitId_grammarId: {
          unitId: unit1.id,
          grammarId: grammar.id,
        },
      },
      update: {
        order: index + 1,
        isCore: true,
      },
      create: {
        unitId: unit1.id,
        grammarId: grammar.id,
        order: index + 1,
        isCore: true,
      },
    });
  }

  console.log("Unit 1 seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
