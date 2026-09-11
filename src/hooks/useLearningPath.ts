import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export type LessonStatus = "completed" | "current" | "locked";

export interface LearningPathLesson {
  id: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  progress: number;
  completed: boolean;
  locked: boolean;
  status: LessonStatus;
  startedAt: string | null;
  completedAt: string | null;
}

interface LearningPathResponse {
  path: LearningPathLesson[];
}

export function useLearningPath() {
  return useQuery<LearningPathResponse>({
    queryKey: ["learning-path"],
    queryFn: () => apiFetch("/api/lessons/path"),
  });
}
