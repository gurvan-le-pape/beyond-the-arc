// src/frontend/features/competitions/pools/api/poolsKeys.ts
export const poolsKeys = {
  all: ["pools"] as const,
  byChampionship: (championshipId: number) =>
    [...poolsKeys.all, "championship", championshipId] as const,
};
