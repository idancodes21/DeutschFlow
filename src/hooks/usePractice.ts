import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export type PracticeMode = "review" | "mistakes";

export interface RecentAttempt {
  isCorrect: boolean;
  createdAt: string;
  activityId: string;
  activityTitle: string | null;
  unitTitle: string;
}

export interface PracticeOverview {
  completedActivities: number;
  mistakeCount: number;
  dueVocabularyCount: number;
  recentAttempts: RecentAttempt[];
}

export interface PracticeActivity {
  id: string;
  type: string;
  order: number;
  title: string | null;
  prompt: string | null;
  explanation: string | null;
  content: Record<string, unknown>;
  audioUrl: string | null;
  imageUrl: string | null;
  xpReward: number;
  sectionTitle: string;
  unitTitle: string;
}

interface OverviewResponse {
  overview: PracticeOverview;
}

interface SessionResponse {
  mode: PracticeMode;
  activities: PracticeActivity[];
}

export function usePracticeOverview() {
  return useQuery<OverviewResponse>({
    queryKey: ["practice-overview"],
    queryFn: () => apiFetch("/api/practice/overview"),
  });
}

export function usePracticeSession(mode: PracticeMode) {
  return useQuery<SessionResponse>({
    queryKey: ["practice-session", mode],
    queryFn: () => apiFetch(`/api/practice/session?mode=${mode}`),
  });
}
