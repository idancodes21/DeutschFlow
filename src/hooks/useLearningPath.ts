import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export type UnitStatus = "completed" | "current" | "locked";

export interface LearningPathUnit {
  id: string;
  title: string;
  description: string | null;
  order: number;
  cefrLevel: string | null;
  progress: number;
  masteryScore: number;
  completed: boolean;
  locked: boolean;
  status: UnitStatus;
  startedAt: string | null;
  completedAt: string | null;
}

export interface LearningPath {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  units: LearningPathUnit[];
}

interface LearningPathResponse {
  path: LearningPath | null;
}

export function useLearningPath() {
  return useQuery<LearningPathResponse>({
    queryKey: ["learning-path"],
    queryFn: () => apiFetch("/api/units/path"),
  });
}
