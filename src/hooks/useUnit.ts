import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export type ActivityType =
  | "INFO"
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "CONJUGATION"
  | "SENTENCE_BUILDER"
  | "MATCH"
  | "WORD_ORDER"
  | "LISTENING_CHOICE";

interface ActivityProgress {
  attempts: number;
  correctCount: number;
  wrongCount: number;
  bestScore: number;
  masteryScore: number;
  completed: boolean;
  lastAttemptAt: string | null;
  completedAt: string | null;
}

export interface UnitActivity {
  id: string;
  type: ActivityType;
  order: number;
  title: string | null;
  prompt: string | null;
  explanation: string | null;
  content: Record<string, unknown>;
  audioUrl: string | null;
  imageUrl: string | null;
  xpReward: number;
  progress: ActivityProgress | null;
}

interface SectionProgress {
  progress: number;
  masteryScore: number;
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}

export interface UnitSection {
  id: string;
  type: string;
  title: string;
  description: string | null;
  order: number;
  progress: SectionProgress | null;
  activities: UnitActivity[];
}

interface UnitProgress {
  progress: number;
  masteryScore: number;
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}

export interface Unit {
  id: string;
  title: string;
  description: string | null;
  order: number;
  cefrLevel: string | null;
  progress: UnitProgress | null;
  sections: UnitSection[];
  vocabulary: Record<string, unknown>[];
  grammar: Record<string, unknown>[];
}

interface UnitResponse {
  unit: Unit;
}

export function useUnit(unitId: string) {
  return useQuery<UnitResponse>({
    queryKey: ["unit", unitId],
    queryFn: () => apiFetch(`/api/units/${unitId}`),
    enabled: Boolean(unitId),
  });
}
