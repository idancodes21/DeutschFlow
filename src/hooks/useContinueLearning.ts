import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export interface ContinueActivity {
  id: string;
  title: string | null;
  order: number;
}

export interface ContinueSection {
  id: string;
  title: string;
  type: string;
  progress: number;
}

export interface ContinueUnit {
  id: string;
  title: string;
  description: string | null;
  order: number;
  cefrLevel: string | null;
  progress: number;
  completed: boolean;
  allCompleted: boolean;
  currentSection: ContinueSection | null;
  currentActivity: ContinueActivity | null;
}

interface ContinueUnitResponse {
  unit: ContinueUnit | null;
}

export function useContinueLearning() {
  return useQuery<ContinueUnitResponse>({
    queryKey: ["continue-unit"],
    queryFn: () => apiFetch("/api/units/continue"),
  });
}
