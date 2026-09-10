import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface LearningProgress {
  id: string;
  level: number;
  xp: number;
  streak: number;
  lessonsCompleted: number;
  wordsLearned: number;
  grammarCompleted: number;
  lastActivityAt: string | null;
}

export interface CurrentUser {
  id: string;
  clerkId: string;
  email: string;
  profile: Profile | null;
  learningProgress: LearningProgress | null;
}

interface CurrentUserResponse {
  user: CurrentUser;
}

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ["current-user"],
    queryFn: () => apiFetch("/api/users/me"),
  });
}
