// src/frontend/features/organizations/leagues/api/leaguesKeys.ts
export const leaguesKeys = {
  all: ["leagues"] as const,
  lists: () => [...leaguesKeys.all, "list"] as const,
  details: () => [...leaguesKeys.all, "detail"] as const,
  detail: (id: number) => [...leaguesKeys.details(), id] as const,
};
