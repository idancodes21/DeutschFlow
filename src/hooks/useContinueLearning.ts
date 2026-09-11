import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export interface ContinueLesson {
  id: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  progress: number;
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}

interface ContinueLessonResponse {
  lesson: ContinueLesson | null;
}

export function useContinueLearning() {
  return useQuery<ContinueLessonResponse>({
    queryKey: ["continue-lesson"],
    queryFn: () => apiFetch("/api/lessons/continue"),
  });
}
