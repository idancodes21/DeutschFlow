import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/*  Types + builders                                                          */

type Explain = {
  title: string;
  prompt: string;
  explanation: string;
  content: Prisma.InputJsonObject;
};

type Exercise =
  | {
      kind: "mc";
      title: string;
      prompt: string;
      explanation: string | null;
      options: string[];
      answer: string;
    }
  | {
      kind: "fill";
      title: string;
      prompt: string;
      explanation: string | null;
      answer: string;
      wordBank?: string[] | undefined;
    }
  | {
      kind: "build";
      title: string;
      prompt: string;
      explanation: string | null;
      words: string[];
      translation: string;
      hint?: string | undefined;
    }
  | {
      kind: "listen";
      title: string;
      prompt: string;
      explanation: string | null;
      audioText: string;
      options: string[];
      answer: string;
    };

const mc = (
  title: string,
  prompt: string,
  explanation: string | null,
  options: string[],
  answer: string,
): Exercise => ({ kind: "mc", title, prompt, explanation, options, answer });

const fill = (
  title: string,
  prompt: string,
  explanation: string | null,
  answer: string,
  wordBank?: string[],
): Exercise => ({ kind: "fill", title, prompt, explanation, answer, wordBank });

const build = (
  title: string,
  prompt: string,
  explanation: string | null,
  words: string[],
  translation: string,
  hint?: string,
): Exercise => ({
  kind: "build",
  title,
  prompt,
  explanation,
  words,
  translation,
  hint,
});

const listen = (
  title: string,
  prompt: string,
  explanation: string | null,
  audioText: string,
  options: string[],
  answer: string,
): Exercise => ({
  kind: "listen",
  title,
  prompt,
  explanation,
  audioText,
  options,
  answer,
});

type VocabDef = {
  slug: string;
  german: string;
  english: string;
  article: string | null;
  plural: string | null;
  example: string;
  category: string;
};

type GrammarDef = {
  slug: string;
  title: string;
  explanation: string;
  example: string;
  category: string;
};

type UnitDef = {
  n: number;
  title: string;
  description: string;
  explain: Explain[];
  drills: Exercise[];
  guided: Exercise[];
  recall: Exercise[];
  mixed: Exercise[];
  listening: Exercise[];
  completion: { explanation: string; body: string; audioText: string };
  vocabulary: VocabDef[];
  grammar: GrammarDef[];
};

const SECTIONS = [
  {
    slug: "explainer",
    type: "EXPLAINER" as const,
    title: "See the pattern",
    description:
      "A short look at the rule, with examples, before you practice it.",
  },
  {
    slug: "pattern-drills",
    type: "PATTERN_DRILLS" as const,
    title: "Try the pattern",
    description: "Quick, low-pressure reps on the rule alone.",
  },
  {
    slug: "guided-sentence",
    type: "GUIDED_SENTENCE" as const,
    title: "Build a sentence",
    description:
      "Put the pattern to work with the words right there to guide you.",
  },
  {
    slug: "recall",
    type: "RECALL" as const,
    title: "Do it from memory",
    description:
      "Same pattern, hints removed. This is where it starts to stick.",
  },
  {
    slug: "mixed-review",
    type: "MIXED_REVIEW" as const,
    title: "Mix it up",
    description: "Combine everything from this unit in one round.",
  },
  {
    slug: "listening",
    type: "LISTENING" as const,
    title: "Hear it",
    description: "Match the spoken German to what you've learned to read.",
  },
];

const XP = {
  explainer: 2,
  "pattern-drills": 5,
  "guided-sentence": 5,
  recall: 7,
  "mixed-review": 7,
  listening: 10,
  complete: 5,
};

/*  A1 curriculum */

const units: UnitDef[] = [
  /* ------------------------------ Unit 1 --------------------------------- */
  {
    n: 1,
    title: "What's different in German?",
    description:
      "Learn the basic patterns that make German different and predictable.",
    explain: [
      {
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
      },
      {
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
      },
      {
        title: "German nouns are capitalized",
        prompt: "Notice the capital letter in important German nouns.",
        explanation:
          "In German, nouns are written with a capital letter — every noun, not just names. This is one of the easiest patterns to spot, and it instantly helps you find the 'things' in a sentence when reading.",
        content: {
          type: "explanation",
          animation: "highlight-caps",
          audioText: "Das Buch ist neu. Ich lerne Deutsch.",
          examples: [
            { german: "Das Buch ist neu.", english: "The book is new." },
            { german: "Ich lerne Deutsch.", english: "I am learning German." },
          ],
          rule: "Nouns begin with a capital letter.",
        },
      },
      {
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
      },
    ],
    drills: [
      mc(
        "Capitalization",
        "Which sentence uses German capitalization correctly?",
        "German nouns begin with a capital letter.",
        ["Das buch ist neu.", "Das Buch ist neu.", "Das buch ist Neu."],
        "Das Buch ist neu.",
      ),
      mc(
        "Verb position",
        "Which sentence follows the normal German statement pattern?",
        "The conjugated verb comes in the second position.",
        ["Ich Deutsch lerne.", "Ich lerne Deutsch.", "Lerne ich Deutsch."],
        "Ich lerne Deutsch.",
      ),
      fill(
        "Complete the verb",
        "Ich ___ Deutsch.",
        "The subject 'ich' uses the first-person singular verb form.",
        "lerne",
        ["lerne", "lernst", "lernen"],
      ),
      fill(
        "Same pattern, new verb",
        "Ich ___ in Lagos.",
        "Wohnen (to live) works just like lernen: drop -en, add -e for 'ich'.",
        "wohne",
        ["wohne", "wohnst", "wohnen"],
      ),
    ],
    guided: [
      build(
        "Build the sentence",
        "Build the sentence: I am learning German.",
        "Start with the subject, then place the conjugated verb in the second position.",
        ["Ich", "lerne", "Deutsch", "."],
        "I am learning German.",
        "Subject → verb → rest of sentence",
      ),
      build(
        "Move the time expression",
        "Build the sentence: Today I am learning German.",
        "Even when another element comes first, the conjugated verb remains in the second position.",
        ["Heute", "lerne", "ich", "Deutsch", "."],
        "Today I am learning German.",
        "Time → verb → subject → rest",
      ),
    ],
    recall: [
      fill("Recall the verb", "Heute ___ ich Deutsch.", null, "lerne"),
      fill("Recall the verb", "Ich ___ in Lagos.", null, "wohne"),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "Check both the noun capitalization and the verb position.",
        ["Ich lerne deutsch.", "Ich lerne Deutsch.", "Ich Deutsch lerne."],
        "Ich lerne Deutsch.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Use the verb-second pattern and keep the noun capitalized.",
        ["Heute", "lerne", "ich", "Deutsch", "."],
        "Today I am learning German.",
      ),
    ],
    listening: [
      listen(
        "Listen and recognize",
        "Listen carefully. Which sentence did you hear?",
        "You already learned this written pattern. Now connect the written form to its spoken form.",
        "Ich lerne Deutsch.",
        [
          "Ich lerne Deutsch.",
          "Ich lerne Englisch.",
          "Heute lerne ich Deutsch.",
        ],
        "Ich lerne Deutsch.",
      ),
      listen(
        "Listen for word order",
        "Listen and choose the sentence you hear.",
        "Notice the verb position even when 'Heute' comes first.",
        "Heute lerne ich Deutsch.",
        [
          "Heute lerne ich Deutsch.",
          "Heute ich lerne Deutsch.",
          "Ich lerne heute Deutsch.",
        ],
        "Heute lerne ich Deutsch.",
      ),
    ],
    completion: {
      explanation:
        "Two patterns down: capitalized nouns, and verb-second word order. Both will show up in almost every unit from here on.",
      body: "Next up: greetings and the verb sein — so you can say hello and introduce yourself.",
      audioText: "Super gemacht! Well done.",
    },
    vocabulary: [
      {
        slug: "deutsch",
        german: "Deutsch",
        english: "German",
        article: null,
        plural: null,
        example: "Ich lerne Deutsch.",
        category: "language",
      },
      {
        slug: "lernen",
        german: "lernen",
        english: "to learn",
        article: null,
        plural: null,
        example: "Ich lerne Deutsch.",
        category: "verbs",
      },
      {
        slug: "heute",
        german: "heute",
        english: "today",
        article: null,
        plural: null,
        example: "Heute lerne ich Deutsch.",
        category: "time",
      },
      {
        slug: "wohnen",
        german: "wohnen",
        english: "to live",
        article: null,
        plural: null,
        example: "Ich wohne in Lagos.",
        category: "verbs",
      },
    ],
    grammar: [
      {
        slug: "capitalization",
        title: "German noun capitalization",
        explanation:
          "German nouns begin with a capital letter. This makes nouns easier to recognize in written German.",
        example: "Das Buch ist neu.",
        category: "orthography",
      },
      {
        slug: "verb-second",
        title: "Verb-second word order",
        explanation:
          "In a normal German statement, the conjugated verb usually comes in the second position.",
        example: "Heute lerne ich Deutsch.",
        category: "word-order",
      },
    ],
  },

  /* ------------------------------ Unit 2 --------------------------------- */
  {
    n: 2,
    title: "Hallo! Wer bist du?",
    description:
      "Greet people and say who you are and where you're from using sein.",
    explain: [
      {
        title: "Saying hello",
        prompt:
          "German greetings change with the time of day and how formal you need to be.",
        explanation:
          "Hallo is casual. Guten Morgen, Guten Tag and Guten Abend work almost anywhere. For goodbye, Tschüss is casual and Auf Wiedersehen is formal.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText: "Hallo! Guten Morgen! Guten Tag! Guten Abend! Tschüss!",
          examples: [
            { german: "Guten Morgen!", english: "Good morning!" },
            { german: "Guten Tag!", english: "Good day! / Hello!" },
            { german: "Guten Abend!", english: "Good evening!" },
            { german: "Tschüss!", english: "Bye!" },
          ],
          rule: "Hallo and Tschüss are casual; Guten Tag and Auf Wiedersehen suit formal situations.",
        },
      },
      {
        title: "The verb sein",
        prompt:
          "The most important German verb is irregular — so learn it as a set.",
        explanation:
          "Sein (to be) doesn't follow the regular ending pattern. Learn the forms together: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
        content: {
          type: "conjugation",
          animation: "slide-swap",
          audioText: "Ich bin. Du bist. Er ist. Wir sind. Ihr seid. Sie sind.",
          verb: "sein",
          table: [
            { pronoun: "ich", form: "bin" },
            { pronoun: "du", form: "bist" },
            { pronoun: "er / sie / es", form: "ist" },
            { pronoun: "wir", form: "sind" },
            { pronoun: "ihr", form: "seid" },
            { pronoun: "sie / Sie", form: "sind" },
          ],
          example: { german: "Ich bin Amara.", english: "I am Amara." },
        },
      },
      {
        title: "Say where you're from",
        prompt: "Use komme aus + a country to say where you come from.",
        explanation:
          "Kommen follows the regular pattern from Unit 1 (ich komme). The verb is still in second position.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText: "Ich bin Amara. Ich komme aus Nigeria.",
          examples: [
            { german: "Ich bin Amara.", english: "I am Amara." },
            {
              german: "Ich komme aus Nigeria.",
              english: "I come from Nigeria.",
            },
          ],
          rule: "ich komme aus + country.",
        },
      },
      {
        title: "du or Sie?",
        prompt: "German has two ways to say 'you'.",
        explanation:
          "Use du with friends, family and people your age. Use Sie (always capital S) with strangers, teachers and in formal situations. Sie takes the same verb form as 'they': Sie sind.",
        content: {
          type: "explanation",
          animation: "highlight-caps",
          audioText: "Du bist Student. Sie sind Lehrerin.",
          examples: [
            {
              german: "Du bist Student.",
              english: "You are a student. (informal)",
            },
            {
              german: "Sie sind Lehrerin.",
              english: "You are a teacher. (formal)",
            },
          ],
          rule: "du = informal, Sie = formal. Sie sind, du bist.",
        },
      },
    ],
    drills: [
      mc(
        "Pick the form",
        "Which sentence is correct?",
        "Ich goes with bin.",
        ["Ich bist Amara.", "Ich bin Amara.", "Ich ist Amara."],
        "Ich bin Amara.",
      ),
      fill(
        "Complete the verb",
        "Du ___ Student.",
        "Du goes with bist.",
        "bist",
        ["bin", "bist", "ist"],
      ),
      mc(
        "Formal or casual?",
        "Which greeting fits a formal meeting during the day?",
        "Guten Tag works in formal settings; Hallo and Tschüss are casual.",
        ["Tschüss!", "Guten Tag!", "Hallo!"],
        "Guten Tag!",
      ),
      fill(
        "We are",
        "Wir ___ in Lagos.",
        "Wir and sie/Sie share the form sind.",
        "sind",
        ["sind", "seid", "bist"],
      ),
      mc(
        "Who is 'you'?",
        "Which word do you use with your teacher?",
        "Sie is the formal 'you'.",
        ["du", "Sie", "ihr"],
        "Sie",
      ),
    ],
    guided: [
      build(
        "Introduce yourself",
        "Build the sentence: I am Amara.",
        "Subject, then sein, then the name.",
        ["Ich", "bin", "Amara", "."],
        "I am Amara.",
        "Subject → sein → name",
      ),
      build(
        "Where you're from",
        "Build the sentence: I come from Nigeria.",
        "Komme stays in second position.",
        ["Ich", "komme", "aus", "Nigeria", "."],
        "I come from Nigeria.",
      ),
      build(
        "Verb-second again",
        "Build the sentence: Today we are in Berlin.",
        "Heute takes first place, so the verb stays second and the subject follows.",
        ["Heute", "sind", "wir", "in", "Berlin", "."],
        "Today we are in Berlin.",
        "Time → verb → subject → rest",
      ),
    ],
    recall: [
      fill("Recall sein", "Er ___ aus Nigeria.", null, "ist"),
      fill("Recall sein", "Wir ___ heute in Lagos.", null, "sind"),
      fill("Recall kommen", "Ich ___ aus Nigeria.", null, "komme"),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "Check the verb position, the verb form and the capital letter on the country.",
        [
          "Ich komme aus Nigeria.",
          "Ich aus Nigeria komme.",
          "Ich komme aus nigeria.",
        ],
        "Ich komme aus Nigeria.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Use verb-second and the right form of sein.",
        ["Heute", "bist", "du", "in", "Berlin", "."],
        "Today you are in Berlin.",
      ),
    ],
    listening: [
      listen(
        "Listen and recognize",
        "Which sentence did you hear?",
        "Notice the greeting and the verb form.",
        "Guten Morgen, ich bin Amara.",
        [
          "Guten Morgen, ich bin Amara.",
          "Guten Abend, ich bin Amara.",
          "Guten Morgen, du bist Amara.",
        ],
        "Guten Morgen, ich bin Amara.",
      ),
      listen(
        "Listen for sein",
        "Which sentence did you hear?",
        "Wir sind vs ihr seid sound different — listen for the ending.",
        "Wir sind in Berlin.",
        ["Wir sind in Berlin.", "Wir sind in Lagos.", "Ihr seid in Berlin."],
        "Wir sind in Berlin.",
      ),
    ],
    completion: {
      explanation:
        "You can greet people and say who and where you are. Sein will appear in almost every conversation you have.",
      body: "Next up: numbers — so you can count and say how old you are.",
      audioText: "Sehr gut! Very good.",
    },
    vocabulary: [
      {
        slug: "hallo",
        german: "Hallo",
        english: "hello",
        article: null,
        plural: null,
        example: "Hallo! Ich bin Amara.",
        category: "greetings",
      },
      {
        slug: "guten-tag",
        german: "Guten Tag",
        english: "hello / good day",
        article: null,
        plural: null,
        example: "Guten Tag, Frau Weber.",
        category: "greetings",
      },
      {
        slug: "tschuess",
        german: "Tschüss",
        english: "bye",
        article: null,
        plural: null,
        example: "Tschüss, bis morgen!",
        category: "greetings",
      },
      {
        slug: "sein",
        german: "sein",
        english: "to be",
        article: null,
        plural: null,
        example: "Ich bin Amara.",
        category: "verbs",
      },
      {
        slug: "kommen",
        german: "kommen",
        english: "to come",
        article: null,
        plural: null,
        example: "Ich komme aus Nigeria.",
        category: "verbs",
      },
    ],
    grammar: [
      {
        slug: "sein",
        title: "The verb sein (to be)",
        explanation:
          "Sein is irregular: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.",
        example: "Ich bin Amara.",
        category: "verbs",
      },
      {
        slug: "du-sie",
        title: "du vs Sie",
        explanation:
          "Use du with friends and family, and Sie (capital S) in formal situations.",
        example: "Sie sind Lehrerin.",
        category: "register",
      },
    ],
  },

  /* ------------------------------ Unit 3 --------------------------------- */
  {
    n: 3,
    title: "Zahlen und Alter",
    description: "Count in German and say how old you are.",
    explain: [
      {
        title: "Count to ten",
        prompt: "Learn 0 to 10 as a set — everything else is built from them.",
        explanation:
          "These are the building blocks. Say them out loud a few times; the larger numbers reuse them.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText:
            "null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn",
          examples: [
            {
              german: "0 null, 1 eins, 2 zwei, 3 drei",
              english: "zero to three",
            },
            {
              german: "4 vier, 5 fünf, 6 sechs, 7 sieben",
              english: "four to seven",
            },
            { german: "8 acht, 9 neun, 10 zehn", english: "eight to ten" },
          ],
          rule: "Learn 0–10 as a set; 13–19 are built from them.",
        },
      },
      {
        title: "Eleven to twenty",
        prompt: "Eleven and twelve are special. After that, there's a pattern.",
        explanation:
          "Elf and zwölf are their own words. From 13 to 19 you add -zehn to the smaller number: drei + zehn = dreizehn. Two spelling quirks: sechs → sechzehn and sieben → siebzehn.",
        content: {
          type: "explanation",
          animation: "slide-swap",
          audioText:
            "elf, zwölf, dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig",
          examples: [
            { german: "11 elf, 12 zwölf", english: "special words" },
            {
              german: "13 dreizehn, 14 vierzehn, 15 fünfzehn",
              english: "number + zehn",
            },
            {
              german:
                "16 sechzehn, 17 siebzehn, 18 achtzehn, 19 neunzehn, 20 zwanzig",
              english: "same, with spelling quirks",
            },
          ],
          rule: "13–19 = smaller number + zehn.",
        },
      },
      {
        title: "Above twenty: backwards",
        prompt: "German says the ones before the tens.",
        explanation:
          "21 is einundzwanzig — literally 'one-and-twenty'. Say the ones, then und, then the tens, all written as one word. The tens: zwanzig, dreißig, vierzig, fünfzig.",
        content: {
          type: "explanation",
          animation: "slide-swap",
          audioText: "einundzwanzig, vierunddreißig, fünfundvierzig",
          examples: [
            {
              german: "einundzwanzig",
              english: "21 (one-and-twenty)",
              breakdown: ["ein", "und", "zwanzig"],
            },
            {
              german: "vierunddreißig",
              english: "34 (four-and-thirty)",
              breakdown: ["vier", "und", "dreißig"],
            },
            {
              german: "fünfundvierzig",
              english: "45 (five-and-forty)",
              breakdown: ["fünf", "und", "vierzig"],
            },
          ],
          rule: "ones + und + tens, written as one word.",
        },
      },
      {
        title: "Saying your age",
        prompt: "German says 'I am 21 years old' — with sein, not 'have'.",
        explanation:
          "Use sein plus the number plus Jahre alt. To ask, say Wie alt bist du? The question word comes first and the verb is still second.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText: "Ich bin einundzwanzig Jahre alt. Wie alt bist du?",
          examples: [
            {
              german: "Ich bin einundzwanzig Jahre alt.",
              english: "I am twenty-one years old.",
            },
            { german: "Wie alt bist du?", english: "How old are you?" },
          ],
          rule: "Ich bin ___ Jahre alt. Wie alt bist du?",
        },
      },
    ],
    drills: [
      mc(
        "Number match",
        "Which number is 'sieben'?",
        "Sieben is seven.",
        ["6", "7", "8"],
        "7",
      ),
      mc(
        "Careful: 14 or 40?",
        "How do you say 14 in German?",
        "-zehn marks 13–19; -zig marks the tens.",
        ["vierzehn", "vierzig", "vier"],
        "vierzehn",
      ),
      mc(
        "Backwards numbers",
        "How do you say 23?",
        "Ones first: drei + und + zwanzig.",
        ["dreiundzwanzig", "zwanzigdrei", "zweiunddreißig"],
        "dreiundzwanzig",
      ),
      fill(
        "Complete the phrase",
        "Ich bin zwanzig Jahre ___.",
        "German says 'years old' with alt.",
        "alt",
        ["alt", "alte", "alter"],
      ),
      mc(
        "Ask the question",
        "Which question correctly asks someone's age?",
        "Question word first, verb second.",
        ["Wie alt bist du?", "Wie bist du alt?", "Wie alt du bist?"],
        "Wie alt bist du?",
      ),
    ],
    guided: [
      build(
        "Say your age",
        "Build the sentence: I am twenty years old.",
        "Sein, number, then Jahre alt.",
        ["Ich", "bin", "zwanzig", "Jahre", "alt", "."],
        "I am twenty years old.",
      ),
      build(
        "Ask the question",
        "Build the question: How old are you?",
        "Question word first, verb second.",
        ["Wie", "alt", "bist", "du", "?"],
        "How old are you?",
        "Question word → verb → subject",
      ),
      build(
        "A bigger number",
        "Build the sentence: I am twenty-one years old.",
        "Ones before tens, written as one word.",
        ["Ich", "bin", "einundzwanzig", "Jahre", "alt", "."],
        "I am twenty-one years old.",
      ),
    ],
    recall: [
      fill("Recall the question", "Wie ___ bist du?", null, "alt"),
      fill("Recall sein", "Ich ___ fünfzehn Jahre alt.", null, "bin"),
      fill("Recall a number", "Zwei plus drei ist ___.", null, "fünf"),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "German uses sein for age, never haben.",
        [
          "Ich habe zwanzig Jahre alt.",
          "Ich bin zwanzig Jahre alt.",
          "Ich bin alt zwanzig Jahre.",
        ],
        "Ich bin zwanzig Jahre alt.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Use er ist for 'he is'.",
        ["Er", "ist", "achtzehn", "Jahre", "alt", "."],
        "He is eighteen years old.",
      ),
      mc(
        "Quick maths",
        "Zehn plus elf ist ___.",
        "10 + 11 = 21.",
        ["einundzwanzig", "zwölf", "zwanzig"],
        "einundzwanzig",
      ),
    ],
    listening: [
      listen(
        "Hear the age",
        "Which sentence did you hear?",
        "Neunzehn (19), neunzig (90) and neun (9) sound close — listen to the ending.",
        "Ich bin neunzehn Jahre alt.",
        [
          "Ich bin neunzehn Jahre alt.",
          "Ich bin neunzig Jahre alt.",
          "Ich bin neun Jahre alt.",
        ],
        "Ich bin neunzehn Jahre alt.",
      ),
      listen(
        "Hear the question",
        "Which question did you hear?",
        "Notice bist vs ist vs seid.",
        "Wie alt bist du?",
        ["Wie alt bist du?", "Wie alt ist er?", "Wie alt seid ihr?"],
        "Wie alt bist du?",
      ),
      listen(
        "Hear the number",
        "Which number did you hear?",
        "In German the ones come first: fünf + und + vierzig.",
        "fünfundvierzig",
        ["fünfundvierzig", "vierundfünfzig", "fünfzehn"],
        "fünfundvierzig",
      ),
    ],
    completion: {
      explanation:
        "You can count to fifty and talk about age. The 'ones first' pattern will come back with prices and dates.",
      body: "Next up: people and things — der, die, das, and how to talk about your family.",
      audioText: "Prima! Great job.",
    },
    vocabulary: [
      {
        slug: "zahl",
        german: "Zahl",
        english: "number",
        article: "die",
        plural: "Zahlen",
        example: "Zwanzig ist eine Zahl.",
        category: "numbers",
      },
      {
        slug: "jahr",
        german: "Jahr",
        english: "year",
        article: "das",
        plural: "Jahre",
        example: "Ich bin zwanzig Jahre alt.",
        category: "time",
      },
      {
        slug: "alt",
        german: "alt",
        english: "old",
        article: null,
        plural: null,
        example: "Wie alt bist du?",
        category: "adjectives",
      },
      {
        slug: "wie",
        german: "wie",
        english: "how",
        article: null,
        plural: null,
        example: "Wie alt bist du?",
        category: "question-words",
      },
    ],
    grammar: [
      {
        slug: "numbers-21-plus",
        title: "Numbers above twenty",
        explanation:
          "Say the ones first, then und, then the tens, written as one word.",
        example: "einundzwanzig",
        category: "numbers",
      },
      {
        slug: "age-with-sein",
        title: "Age uses sein",
        explanation:
          "German says 'I am X years old' with sein, and the question word comes first.",
        example: "Wie alt bist du?",
        category: "verbs",
      },
    ],
  },

  /* ------------------------------ Unit 4 --------------------------------- */
  {
    n: 4,
    title: "Familie und Menschen",
    description:
      "Meet der, die and das, and talk about the people in your family.",
    explain: [
      {
        title: "Three genders",
        prompt: "Every German noun is der, die or das.",
        explanation:
          "Der is masculine, die is feminine, das is neuter. Gender is grammar, not biology, so don't try to guess — learn every noun together with its article.",
        content: {
          type: "explanation",
          animation: "highlight-caps",
          audioText: "der Vater, die Mutter, das Kind",
          examples: [
            { german: "der Vater", english: "the father" },
            { german: "die Mutter", english: "the mother" },
            { german: "das Kind", english: "the child" },
          ],
          rule: "Learn each noun with its article: der Vater, not just Vater.",
        },
      },
      {
        title: "ein and eine",
        prompt: "'A' also has gender.",
        explanation:
          "Der and das nouns use ein. Die nouns use eine. So: ein Bruder, ein Kind, eine Schwester.",
        content: {
          type: "explanation",
          animation: "slide-swap",
          audioText: "ein Bruder, eine Schwester, ein Kind",
          examples: [
            { german: "ein Bruder", english: "a brother (der)" },
            { german: "eine Schwester", english: "a sister (die)" },
            { german: "ein Kind", english: "a child (das)" },
          ],
          rule: "der/das → ein. die → eine.",
        },
      },
      {
        title: "mein and meine",
        prompt: "'My' follows the same pattern as ein.",
        explanation:
          "Once you know ein/eine, you already know mein/meine: add m- for 'my'. Masculine and neuter get mein, feminine gets meine.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText:
            "Das ist mein Bruder. Das ist meine Schwester. Das ist mein Buch.",
          examples: [
            { german: "Das ist mein Bruder.", english: "This is my brother." },
            {
              german: "Das ist meine Schwester.",
              english: "This is my sister.",
            },
            { german: "Das ist mein Buch.", english: "This is my book." },
          ],
          rule: "mein for der/das nouns, meine for die nouns.",
        },
      },
      {
        title: "er, sie, es",
        prompt: "The pronoun matches the noun's gender.",
        explanation:
          "Der nouns are replaced by er, die nouns by sie, das nouns by es. That's how you keep talking about the same person without repeating the noun.",
        content: {
          type: "explanation",
          animation: "slide-swap",
          audioText:
            "Das ist mein Vater. Er ist fünfzig Jahre alt. Das ist meine Mutter. Sie ist achtundvierzig Jahre alt.",
          examples: [
            {
              german: "Das ist mein Vater. Er ist fünfzig Jahre alt.",
              english: "This is my father. He is fifty.",
            },
            {
              german: "Das ist meine Mutter. Sie ist achtundvierzig Jahre alt.",
              english: "This is my mother. She is forty-eight.",
            },
          ],
          rule: "der → er, die → sie, das → es.",
        },
      },
    ],
    drills: [
      mc(
        "Pick the article",
        "Which article goes with 'Mutter'?",
        "Mutter is feminine.",
        ["der", "die", "das"],
        "die",
      ),
      mc(
        "ein or eine?",
        "Which is correct?",
        "Die nouns take eine.",
        ["ein Schwester", "eine Schwester", "eine Bruder"],
        "eine Schwester",
      ),
      fill(
        "mein or meine?",
        "Das ist ___ Bruder.",
        "Der Bruder is masculine.",
        "mein",
        ["mein", "meine", "meiner"],
      ),
      fill(
        "mein or meine?",
        "Das ist ___ Mutter.",
        "Die Mutter is feminine.",
        "meine",
        ["mein", "meine", "meiner"],
      ),
      mc(
        "Pick the pronoun",
        "Which pronoun replaces 'die Schwester'?",
        "Die → sie.",
        ["er", "sie", "es"],
        "sie",
      ),
    ],
    guided: [
      build(
        "Introduce your father",
        "Build the sentence: This is my father.",
        "Das ist + mein + noun.",
        ["Das", "ist", "mein", "Vater", "."],
        "This is my father.",
      ),
      build(
        "Introduce your sister",
        "Build the sentence: This is my sister.",
        "Sister is feminine, so use meine.",
        ["Das", "ist", "meine", "Schwester", "."],
        "This is my sister.",
      ),
      build(
        "Say her age",
        "Build the sentence: My mother is fifty years old.",
        "The subject can be a longer phrase; the verb is still second.",
        ["Meine", "Mutter", "ist", "fünfzig", "Jahre", "alt", "."],
        "My mother is fifty years old.",
      ),
    ],
    recall: [
      fill("Recall mein/meine", "Das ist ___ Schwester.", null, "meine"),
      fill("Recall mein/meine", "Das ist ___ Kind.", null, "mein"),
      fill(
        "Recall the pronoun",
        "Das ist mein Bruder. ___ ist zwanzig Jahre alt.",
        null,
        "Er",
      ),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "Mutter is die, so it takes eine.",
        ["Das ist ein Mutter.", "Das ist eine Mutter.", "Das ist eine Vater."],
        "Das ist eine Mutter.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Meine/mein, then sein, then age.",
        ["Mein", "Bruder", "ist", "achtzehn", "Jahre", "alt", "."],
        "My brother is eighteen years old.",
      ),
      mc(
        "Pick the pronoun",
        "Das ist die Schwester. ___ ist siebzehn Jahre alt.",
        "Die → sie.",
        ["Er", "Sie", "Es"],
        "Sie",
      ),
    ],
    listening: [
      listen(
        "Who is it?",
        "Which sentence did you hear?",
        "Listen for mein vs meine.",
        "Das ist meine Mutter.",
        [
          "Das ist meine Mutter.",
          "Das ist mein Vater.",
          "Das ist meine Schwester.",
        ],
        "Das ist meine Mutter.",
      ),
      listen(
        "Family and age",
        "Which sentence did you hear?",
        "Acht (8) and achtzehn (18) sound different at the end.",
        "Mein Bruder ist achtzehn Jahre alt.",
        [
          "Mein Bruder ist achtzehn Jahre alt.",
          "Mein Bruder ist acht Jahre alt.",
          "Meine Schwester ist achtzehn Jahre alt.",
        ],
        "Mein Bruder ist achtzehn Jahre alt.",
      ),
    ],
    completion: {
      explanation:
        "You know the three genders, ein/eine, mein/meine and er/sie/es. These four ideas are the backbone of German nouns.",
      body: "Next up: daily activities — regular verbs and their endings.",
      audioText: "Toll! Great.",
    },
    vocabulary: [
      {
        slug: "vater",
        german: "Vater",
        english: "father",
        article: "der",
        plural: "Väter",
        example: "Das ist mein Vater.",
        category: "family",
      },
      {
        slug: "mutter",
        german: "Mutter",
        english: "mother",
        article: "die",
        plural: "Mütter",
        example: "Das ist meine Mutter.",
        category: "family",
      },
      {
        slug: "bruder",
        german: "Bruder",
        english: "brother",
        article: "der",
        plural: "Brüder",
        example: "Das ist mein Bruder.",
        category: "family",
      },
      {
        slug: "schwester",
        german: "Schwester",
        english: "sister",
        article: "die",
        plural: "Schwestern",
        example: "Das ist meine Schwester.",
        category: "family",
      },
      {
        slug: "kind",
        german: "Kind",
        english: "child",
        article: "das",
        plural: "Kinder",
        example: "Das ist ein Kind.",
        category: "people",
      },
    ],
    grammar: [
      {
        slug: "gender-articles",
        title: "Gender: der, die, das",
        explanation:
          "Every noun has a gender. Learn each noun with its article.",
        example: "der Vater, die Mutter, das Kind",
        category: "nouns",
      },
      {
        slug: "ein-mein",
        title: "ein/eine and mein/meine",
        explanation:
          "Der and das nouns take ein/mein; die nouns take eine/meine.",
        example: "Das ist meine Schwester.",
        category: "nouns",
      },
      {
        slug: "er-sie-es",
        title: "Pronouns match gender",
        explanation: "Der → er, die → sie, das → es.",
        example: "Das ist mein Vater. Er ist fünfzig.",
        category: "pronouns",
      },
    ],
  },

  /* ------------------------------ Unit 5 --------------------------------- */
  {
    n: 5,
    title: "Was machst du heute?",
    description:
      "Use regular verb endings to talk about what you and others do.",
    explain: [
      {
        title: "Stem + ending",
        prompt: "Most German verbs follow one set of endings.",
        explanation:
          "Take the infinitive, drop -en to get the stem, then add an ending: -e, -st, -t, -en, -t, -en. Spielen → spiel- → ich spiele, du spielst, er spielt.",
        content: {
          type: "conjugation",
          animation: "slide-swap",
          audioText:
            "ich spiele, du spielst, er spielt, wir spielen, ihr spielt, sie spielen",
          verb: "spielen",
          table: [
            { pronoun: "ich", form: "spiele" },
            { pronoun: "du", form: "spielst" },
            { pronoun: "er / sie / es", form: "spielt" },
            { pronoun: "wir", form: "spielen" },
            { pronoun: "ihr", form: "spielt" },
            { pronoun: "sie / Sie", form: "spielen" },
          ],
          example: {
            german: "Ich spiele Fußball.",
            english: "I play football.",
          },
        },
      },
      {
        title: "Same endings, new verbs",
        prompt: "Once you know the pattern, every regular verb works.",
        explanation:
          "Kochen (to cook) and machen (to do/make) use exactly the same endings. To ask what someone is doing, use Was (what) first: Was machst du heute?",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText:
            "Ich koche. Du kochst. Er kocht. Was machst du heute? Heute koche ich.",
          examples: [
            {
              german: "Ich koche. Du kochst. Er kocht.",
              english: "I cook. You cook. He cooks.",
            },
            {
              german: "Was machst du heute?",
              english: "What are you doing today?",
            },
            { german: "Heute koche ich.", english: "Today I'm cooking." },
          ],
          rule: "Same endings for every regular verb.",
        },
      },
      {
        title: "wir, sie and Sie look like the infinitive",
        prompt: "Three forms are identical to the dictionary form.",
        explanation:
          "For wir, sie (they) and Sie (formal you), the verb form equals the infinitive: wir spielen, sie spielen, Sie spielen. That makes them the easiest forms to remember.",
        content: {
          type: "explanation",
          animation: "highlight-caps",
          audioText: "Wir wohnen in Lagos. Wir spielen Fußball.",
          examples: [
            { german: "Wir wohnen in Lagos.", english: "We live in Lagos." },
            { german: "Wir spielen Fußball.", english: "We play football." },
          ],
          rule: "wir / sie / Sie → infinitive form.",
        },
      },
    ],
    drills: [
      fill("Pick the ending", "Du ___ Fußball.", "Du takes -st.", "spielst", [
        "spiele",
        "spielst",
        "spielt",
      ]),
      fill("Pick the ending", "Er ___ heute.", "Er takes -t.", "kocht", [
        "koche",
        "kochst",
        "kocht",
      ]),
      mc(
        "Pick the sentence",
        "Which sentence is correct?",
        "Wir takes the -en form.",
        ["Wir spielt Fußball.", "Wir spielen Fußball.", "Wir spielst Fußball."],
        "Wir spielen Fußball.",
      ),
      fill("Pick the ending", "Ihr ___ Fußball.", "Ihr takes -t.", "spielt", [
        "spielt",
        "spielst",
        "spielen",
      ]),
      mc(
        "Read the question",
        "What does 'Was machst du heute?' ask?",
        "Was = what, machst = you do.",
        ["What are you doing today?", "Where do you live?", "Who are you?"],
        "What are you doing today?",
      ),
    ],
    guided: [
      build(
        "Say what you do",
        "Build the sentence: I play football.",
        "Ich → spiele.",
        ["Ich", "spiele", "Fußball", "."],
        "I play football.",
      ),
      build(
        "Time first",
        "Build the sentence: Today I am cooking.",
        "Heute first, verb second.",
        ["Heute", "koche", "ich", "."],
        "Today I am cooking.",
      ),
      build(
        "Ask the question",
        "Build the question: What are you doing today?",
        "Question word first, then the verb.",
        ["Was", "machst", "du", "heute", "?"],
        "What are you doing today?",
      ),
    ],
    recall: [
      fill(
        "Recall the ending",
        "Du ___ heute Fußball. (spielen)",
        null,
        "spielst",
      ),
      fill("Recall the ending", "Er ___ jetzt. (kochen)", null, "kocht"),
      fill("Recall the ending", "Wir ___ in Lagos. (wohnen)", null, "wohnen"),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "Ich takes -e.",
        ["Ich lernen Deutsch.", "Ich lerne Deutsch.", "Ich lernt Deutsch."],
        "Ich lerne Deutsch.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Jetzt first, verb second.",
        ["Jetzt", "spielen", "wir", "Fußball", "."],
        "Now we play football.",
      ),
      fill(
        "Pull it together",
        "Meine Schwester ___ Fußball. (spielen)",
        null,
        "spielt",
      ),
    ],
    listening: [
      listen(
        "Hear the ending",
        "Which sentence did you hear?",
        "Listen for -st, -t and -en.",
        "Du spielst heute Fußball.",
        [
          "Du spielst heute Fußball.",
          "Er spielt heute Fußball.",
          "Wir spielen heute Fußball.",
        ],
        "Du spielst heute Fußball.",
      ),
      listen(
        "Hear the question",
        "Which question did you hear?",
        "Machst, macht and machen sound different at the end.",
        "Was machst du heute?",
        [
          "Was machst du heute?",
          "Was macht er heute?",
          "Was machen wir heute?",
        ],
        "Was machst du heute?",
      ),
    ],
    completion: {
      explanation:
        "One set of endings now unlocks hundreds of verbs. You'll keep using it for the rest of the course.",
      body: "Next up: food and drinks — ordering something and meeting the accusative.",
      audioText: "Weiter so! Keep going.",
    },
    vocabulary: [
      {
        slug: "spielen",
        german: "spielen",
        english: "to play",
        article: null,
        plural: null,
        example: "Ich spiele Fußball.",
        category: "verbs",
      },
      {
        slug: "kochen",
        german: "kochen",
        english: "to cook",
        article: null,
        plural: null,
        example: "Heute koche ich.",
        category: "verbs",
      },
      {
        slug: "machen",
        german: "machen",
        english: "to do, to make",
        article: null,
        plural: null,
        example: "Was machst du heute?",
        category: "verbs",
      },
      {
        slug: "jetzt",
        german: "jetzt",
        english: "now",
        article: null,
        plural: null,
        example: "Jetzt spielen wir Fußball.",
        category: "time",
      },
      {
        slug: "fussball",
        german: "Fußball",
        english: "football",
        article: "der",
        plural: null,
        example: "Ich spiele Fußball.",
        category: "hobbies",
      },
    ],
    grammar: [
      {
        slug: "present-endings",
        title: "Regular present-tense endings",
        explanation:
          "Drop -en from the infinitive and add -e, -st, -t, -en, -t, -en.",
        example: "Du spielst Fußball.",
        category: "verbs",
      },
      {
        slug: "was-question",
        title: "Questions with Was",
        explanation: "The question word comes first and the verb stays second.",
        example: "Was machst du heute?",
        category: "word-order",
      },
    ],
  },

  /* ------------------------------ Unit 6 --------------------------------- */
  {
    n: 6,
    title: "Essen und Trinken",
    description:
      "Order food and drinks politely and meet your first accusative.",
    explain: [
      {
        title: "Ordering with möchten",
        prompt: "'I would like' is the polite way to ask for something.",
        explanation:
          "Möchten (would like) is slightly irregular: ich möchte, du möchtest, er/sie möchte, wir möchten. Notice that er/sie has no -t.",
        content: {
          type: "conjugation",
          animation: "slide-swap",
          audioText: "ich möchte, du möchtest, er möchte, wir möchten",
          verb: "möchten",
          table: [
            { pronoun: "ich", form: "möchte" },
            { pronoun: "du", form: "möchtest" },
            { pronoun: "er / sie / es", form: "möchte" },
            { pronoun: "wir", form: "möchten" },
          ],
          example: {
            german: "Ich möchte einen Kaffee.",
            english: "I would like a coffee.",
          },
        },
      },
      {
        title: "The object changes (accusative)",
        prompt:
          "What you eat or drink is the object — and masculine nouns change.",
        explanation:
          "When a masculine noun is the object, der becomes den and ein becomes einen. Feminine and neuter nouns stay the same: eine Milch, ein Brot.",
        content: {
          type: "explanation",
          animation: "slide-swap",
          audioText:
            "Ich trinke einen Tee. Ich trinke eine Milch. Ich esse ein Brot.",
          examples: [
            {
              german: "Ich trinke einen Tee.",
              english: "I drink a tea. (der Tee)",
            },
            {
              german: "Ich trinke eine Milch.",
              english: "I drink a milk. (die Milch)",
            },
            {
              german: "Ich esse ein Brot.",
              english: "I eat a bread. (das Brot)",
            },
          ],
          rule: "Only masculine changes: der → den, ein → einen.",
        },
      },
      {
        title: "Eating and drinking verbs",
        prompt: "Trinken is regular. Essen has a small twist.",
        explanation:
          "Trinken (to drink) is regular. Essen (to eat) is regular for ich, but du and er both become isst: du isst, er isst.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText:
            "Ich trinke Wasser. Du isst einen Apfel. Er isst ein Brot.",
          examples: [
            { german: "Ich trinke Wasser.", english: "I drink water." },
            { german: "Du isst einen Apfel.", english: "You eat an apple." },
            { german: "Er isst ein Brot.", english: "He eats a bread." },
          ],
          rule: "ich esse, du isst, er isst.",
        },
      },
      {
        title: "Ordering politely",
        prompt: "Add bitte and danke to sound natural.",
        explanation:
          "Bitte means 'please' (and also 'you're welcome'). Danke is 'thank you'. A short order like 'Einen Kaffee, bitte.' is perfectly normal.",
        content: {
          type: "explanation",
          animation: "fade-up",
          audioText: "Einen Kaffee, bitte. Danke!",
          examples: [
            { german: "Einen Kaffee, bitte.", english: "A coffee, please." },
            { german: "Danke!", english: "Thank you!" },
          ],
          rule: "bitte = please / you're welcome. danke = thanks.",
        },
      },
    ],
    drills: [
      fill(
        "Pick the article",
        "Ich möchte ___ Kaffee.",
        "Der Kaffee is masculine, so ein becomes einen.",
        "einen",
        ["ein", "einen", "eine"],
      ),
      fill(
        "Pick the article",
        "Ich möchte ___ Milch.",
        "Die Milch is feminine and doesn't change.",
        "eine",
        ["ein", "einen", "eine"],
      ),
      fill(
        "Pick the article",
        "Ich möchte ___ Brot.",
        "Das Brot is neuter and doesn't change.",
        "ein",
        ["ein", "einen", "eine"],
      ),
      mc(
        "Pick the sentence",
        "Which sentence is correct?",
        "Der Tee is masculine → einen Tee.",
        [
          "Ich trinke ein Tee.",
          "Ich trinke einen Tee.",
          "Ich trinke eine Tee.",
        ],
        "Ich trinke einen Tee.",
      ),
      mc(
        "What changes?",
        "Which article changes when the noun is the object?",
        "Only masculine changes.",
        ["der → den", "die → den", "das → den"],
        "der → den",
      ),
    ],
    guided: [
      build(
        "Order a drink",
        "Build the sentence: I would like a coffee.",
        "Möchte, then einen (Kaffee is masculine).",
        ["Ich", "möchte", "einen", "Kaffee", "."],
        "I would like a coffee.",
      ),
      build(
        "Simple drink",
        "Build the sentence: I drink water.",
        "No article needed here.",
        ["Ich", "trinke", "Wasser", "."],
        "I drink water.",
      ),
      build(
        "Short order",
        "Build the order: A tea, please.",
        "Einen because Tee is masculine.",
        ["Einen", "Tee", ",", "bitte", "."],
        "A tea, please.",
      ),
      build(
        "Someone else eats",
        "Build the sentence: He eats an apple.",
        "Der Apfel is masculine.",
        ["Er", "isst", "einen", "Apfel", "."],
        "He eats an apple.",
      ),
    ],
    recall: [
      fill(
        "Recall the article",
        "Ich möchte ___ Apfel. (der Apfel)",
        null,
        "einen",
      ),
      fill(
        "Recall the article",
        "Ich möchte ___ Milch. (die Milch)",
        null,
        "eine",
      ),
      fill("Recall the verb", "Du ___ Wasser. (trinken)", null, "trinkst"),
    ],
    mixed: [
      mc(
        "Mix the patterns",
        "Which sentence is correct?",
        "Kaffee is masculine, so einen.",
        [
          "Ich möchte ein Kaffee.",
          "Ich möchte einen Kaffee.",
          "Ich möchte eine Kaffee.",
        ],
        "Ich möchte einen Kaffee.",
      ),
      build(
        "Mixed sentence",
        "Build the correct sentence.",
        "Heute first, verb second, einen for a masculine object.",
        ["Heute", "trinke", "ich", "einen", "Tee", "."],
        "Today I drink a tea.",
      ),
      fill(
        "Pull it together",
        "Meine Schwester möchte ___ Apfel. (der Apfel)",
        null,
        "einen",
      ),
    ],
    listening: [
      listen(
        "At the café",
        "Which sentence did you hear?",
        "Listen for einen, eine and ein.",
        "Ich möchte einen Kaffee, bitte.",
        [
          "Ich möchte einen Kaffee, bitte.",
          "Ich möchte eine Milch, bitte.",
          "Ich möchte ein Brot, bitte.",
        ],
        "Ich möchte einen Kaffee, bitte.",
      ),
      listen(
        "Who eats what?",
        "Which sentence did you hear?",
        "Listen for the verb and the article.",
        "Er isst einen Apfel.",
        ["Er isst einen Apfel.", "Er trinkt einen Tee.", "Er isst ein Brot."],
        "Er isst einen Apfel.",
      ),
    ],
    completion: {
      explanation:
        "You can order food and drinks, and you've met the accusative. That's a real step toward everyday German.",
      body: "A1 foundations done. Next up: asking questions and the A1 checkpoint.",
      audioText: "Ausgezeichnet! Excellent.",
    },
    vocabulary: [
      {
        slug: "kaffee",
        german: "Kaffee",
        english: "coffee",
        article: "der",
        plural: null,
        example: "Ich möchte einen Kaffee.",
        category: "drinks",
      },
      {
        slug: "tee",
        german: "Tee",
        english: "tea",
        article: "der",
        plural: null,
        example: "Ich trinke einen Tee.",
        category: "drinks",
      },
      {
        slug: "milch",
        german: "Milch",
        english: "milk",
        article: "die",
        plural: null,
        example: "Ich möchte eine Milch.",
        category: "drinks",
      },
      {
        slug: "brot",
        german: "Brot",
        english: "bread",
        article: "das",
        plural: "Brote",
        example: "Ich esse ein Brot.",
        category: "food",
      },
      {
        slug: "apfel",
        german: "Apfel",
        english: "apple",
        article: "der",
        plural: "Äpfel",
        example: "Er isst einen Apfel.",
        category: "food",
      },
      {
        slug: "moechten",
        german: "möchten",
        english: "would like",
        article: null,
        plural: null,
        example: "Ich möchte einen Kaffee.",
        category: "verbs",
      },
      {
        slug: "trinken",
        german: "trinken",
        english: "to drink",
        article: null,
        plural: null,
        example: "Ich trinke Wasser.",
        category: "verbs",
      },
    ],
    grammar: [
      {
        slug: "moechten",
        title: "möchten (would like)",
        explanation:
          "Ich möchte, du möchtest, er/sie möchte, wir möchten. Er/sie has no -t.",
        example: "Ich möchte einen Kaffee.",
        category: "verbs",
      },
      {
        slug: "accusative-masculine",
        title: "Accusative: masculine changes",
        explanation:
          "As an object, der becomes den and ein becomes einen. Feminine and neuter stay the same.",
        example: "Ich trinke einen Tee.",
        category: "cases",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Seed                                                                      */
/* -------------------------------------------------------------------------- */

function exerciseToActivity(
  sectionId: string,
  id: string,
  order: number,
  item: Exercise,
  xpReward: number,
) {
  const base = {
    id,
    sectionId,
    order,
    title: item.title,
    prompt: item.prompt,
    explanation: item.explanation,
    xpReward,
  };

  switch (item.kind) {
    case "mc":
      return {
        ...base,
        type: "MULTIPLE_CHOICE" as const,
        content: { animation: "pop-correct", options: item.options },
        solution: { answer: item.answer } as Prisma.InputJsonObject | null,
      };
    case "fill":
      return {
        ...base,
        type: "FILL_BLANK" as const,
        content: {
          animation: "pop-correct",
          ...(item.wordBank ? { wordBank: item.wordBank } : {}),
        } as Prisma.InputJsonObject,
        solution: { answer: item.answer } as Prisma.InputJsonObject | null,
      };
    case "build":
      return {
        ...base,
        type: "SENTENCE_BUILDER" as const,
        content: {
          animation: "tile-drop",
          wordBank: item.words,
          ...(item.hint ? { hint: item.hint } : {}),
          translation: item.translation,
        } as Prisma.InputJsonObject,
        solution: { correctOrder: item.words } as Prisma.InputJsonObject | null,
      };
    case "listen":
      return {
        ...base,
        type: "LISTENING_CHOICE" as const,
        content: {
          animation: "waveform",
          audioText: item.audioText,
          options: item.options,
        } as Prisma.InputJsonObject,
        solution: { answer: item.answer } as Prisma.InputJsonObject | null,
      };
  }
}

function buildActivities(unit: UnitDef) {
  const n = unit.n;
  const sid = (slug: string) => `unit-${n}-${slug}`;

  const explainer = unit.explain.map((e, i) => ({
    id: `unit${n}-exp-${i}`,
    sectionId: sid("explainer"),
    type: "INFO" as const,
    order: i + 1,
    title: e.title,
    prompt: e.prompt,
    explanation: e.explanation,
    content: e.content,
    solution: null as Prisma.InputJsonObject | null,
    xpReward: XP.explainer,
  }));

  const group = (slug: keyof typeof XP, prefix: string, items: Exercise[]) =>
    items.map((item, i) =>
      exerciseToActivity(
        sid(slug),
        `unit${n}-${prefix}-${i + 1}`,
        i + 1,
        item,
        XP[slug],
      ),
    );

  const drills = group("pattern-drills", "drill", unit.drills);
  const guided = group("guided-sentence", "guided", unit.guided);
  const recall = group("recall", "recall", unit.recall);
  const mixed = group("mixed-review", "mixed", unit.mixed);
  const listening = group("listening", "listen", unit.listening);

  const completion = {
    id: `unit${n}-complete-1`,
    sectionId: sid("listening"),
    type: "INFO" as const,
    order: unit.listening.length + 1,
    title: "Unit complete",
    prompt: `You've finished Unit ${n}.`,
    explanation: unit.completion.explanation,
    content: {
      type: "completion",
      animation: "confetti",
      illustration: "🎉",
      audioText: unit.completion.audioText,
      body: unit.completion.body,
    } as Prisma.InputJsonObject,
    solution: null as Prisma.InputJsonObject | null,
    xpReward: XP.complete,
  };

  return [
    ...explainer,
    ...drills,
    ...guided,
    ...recall,
    ...mixed,
    ...listening,
    completion,
  ];
}

async function seedUnit(pathId: string, unit: UnitDef) {
  const unitId = `unit-${unit.n}`;

  await prisma.unit.upsert({
    where: { id: unitId },
    update: {
      pathId,
      title: unit.title,
      description: unit.description,
      order: unit.n,
      cefrLevel: "A1",
      isPublished: true,
    },
    create: {
      id: unitId,
      pathId,
      title: unit.title,
      description: unit.description,
      order: unit.n,
      cefrLevel: "A1",
      isPublished: true,
    },
  });

  const sectionIds = SECTIONS.map((s) => `${unitId}-${s.slug}`);

  for (const [index, section] of SECTIONS.entries()) {
    const data = {
      unitId,
      type: section.type,
      title: section.title,
      description: section.description,
      order: index + 1,
    };
    await prisma.unitSection.upsert({
      where: { id: `${unitId}-${section.slug}` },
      update: data,
      create: { id: `${unitId}-${section.slug}`, ...data },
    });
  }

  const activities = buildActivities(unit);

  // Move existing orders out of the way so reordering never collides.
  await prisma.activity.updateMany({
    where: { sectionId: { in: sectionIds } },
    data: { order: { increment: 1000 } },
  });

  // Hide anything from the old structure that is no longer in the seed.
  await prisma.activity.updateMany({
    where: {
      sectionId: { in: sectionIds },
      id: { notIn: activities.map((a) => a.id) },
    },
    data: { isPublished: false },
  });

  for (const activity of activities) {
    const { solution, ...rest } = activity;
    const data = {
      ...rest,
      solution: solution === null ? Prisma.DbNull : solution,
      isPublished: true,
    };
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: data,
      create: data,
    });
  }

  for (const [index, v] of unit.vocabulary.entries()) {
    const id = `unit${unit.n}-vocab-${v.slug}`;
    const vocab = {
      german: v.german,
      english: v.english,
      article: v.article,
      plural: v.plural,
      example: v.example,
      level: 1,
      category: v.category,
    };
    await prisma.vocabulary.upsert({
      where: { id },
      update: vocab,
      create: { id, ...vocab },
    });
    await prisma.unitVocabulary.upsert({
      where: { unitId_vocabularyId: { unitId, vocabularyId: id } },
      update: { order: index + 1, isCore: true },
      create: { unitId, vocabularyId: id, order: index + 1, isCore: true },
    });
  }

  for (const [index, g] of unit.grammar.entries()) {
    const id = `unit${unit.n}-grammar-${g.slug}`;
    const grammar = {
      title: g.title,
      explanation: g.explanation,
      example: g.example,
      level: 1,
      category: g.category,
    };
    await prisma.grammar.upsert({
      where: { id },
      update: grammar,
      create: { id, ...grammar },
    });
    await prisma.unitGrammar.upsert({
      where: { unitId_grammarId: { unitId, grammarId: id } },
      update: { order: index + 1, isCore: true },
      create: { unitId, grammarId: id, order: index + 1, isCore: true },
    });
  }

  console.log(`Unit ${unit.n} seeded: ${unit.title}`);
}

async function main() {
  const learningPath = await prisma.learningPath.upsert({
    where: { slug: "german-foundations" },
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

  for (const unit of units) {
    await seedUnit(learningPath.id, unit);
  }

  console.log("A1 seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
