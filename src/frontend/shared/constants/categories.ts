// src/frontend/shared/constants/categories.ts
export const Category = {
  U11: "U11",
  U13: "U13",
  U15: "U15",
  U18: "U18",
  U21: "U21",
  SENIOR: "Senior",
  ALL: "All",
} as const;

export const CATEGORY_LIST = Object.values(Category);
export type Category = (typeof CATEGORY_LIST)[number];
