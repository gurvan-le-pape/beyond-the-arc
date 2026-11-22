// src/frontend/features/organizations/committees/api/committeesKeys.ts
import type { CommitteeFilters } from "../types/CommitteeFilters";

export const committeesKeys = {
  all: ["committees"] as const,
  lists: () => [...committeesKeys.all, "list"] as const,
  list: (filters?: CommitteeFilters) =>
    [...committeesKeys.lists(), filters] as const,
};
