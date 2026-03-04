// src/frontend/shared/constants/event-categories.ts
export const EventCategory = {
  ALL: "all",
  OTHER: "other",
  SCORING: "scoring",
  MISS: "miss",
  DEFENSIVE: "defensive",
  FOUL: "foul",
  TURNOVER: "turnover",
  REBOUND: "rebound",
  GAME: "game",
  SUBSTITUTION: "substitution",
} as const;

export const EVENT_CATEGORY_LIST = Object.values(EventCategory);
export type EventCategory = (typeof EVENT_CATEGORY_LIST)[number];
