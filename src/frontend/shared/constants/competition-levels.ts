// src/frontend/shared/constants/competition-levels.ts
export const CompetitionLevel = {
  DEPARTMENTAL: "departmental",
  REGIONAL: "regional",
  NATIONAL: "national",
  ALL: "all",
} as const;

export const LocalCompetitionLevel = {
  DEPARTMENTAL: CompetitionLevel.DEPARTMENTAL,
  REGIONAL: CompetitionLevel.REGIONAL,
} as const;

export const COMPETITION_LEVEL_LIST = Object.values(CompetitionLevel);
export type CompetitionLevel = (typeof COMPETITION_LEVEL_LIST)[number];
export type LocalCompetitionLevel =
  (typeof LocalCompetitionLevel)[keyof typeof LocalCompetitionLevel];
