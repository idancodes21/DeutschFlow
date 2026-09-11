import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LessonResponse {
  lesson: Lesson;
}

export function useLesson(lessonId: string) {
  return useQuery<LessonResponse>({
    queryKey: ["lesson", lessonId],
    queryFn: () => apiFetch(`/api/lessons/${lessonId}`),
    enabled: Boolean(lessonId),
  });
}
