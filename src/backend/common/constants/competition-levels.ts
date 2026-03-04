// src/backend/common/constants/competition-levels.ts
export const CompetitionLevel = {
  DEPARTMENTAL: "departmental",
  REGIONAL: "regional",
  NATIONAL: "national",
} as const;

export const COMPETITION_LEVEL_LIST = Object.values(CompetitionLevel);
export type CompetitionLevel =
  (typeof CompetitionLevel)[keyof typeof CompetitionLevel];
