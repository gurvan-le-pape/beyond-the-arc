// src/frontend/shared/constants/view-levels.ts
export const ViewLevel = {
  REGION: "region",
  DEPARTMENT: "department",
  CLUBS: "clubs",
} as const;

export const VIEW_LEVEL_LIST = Object.values(ViewLevel);
export type ViewLevel = (typeof VIEW_LEVEL_LIST)[number];
