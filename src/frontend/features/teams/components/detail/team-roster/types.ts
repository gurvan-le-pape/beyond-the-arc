// src/frontend/features/teams/components/detail/team-roster/types.ts
export type SortKey = "name" | "number" | "ppg" | "rpg" | "apg";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
