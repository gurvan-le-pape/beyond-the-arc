// src/frontend/features/teams/types/TeamsPaginatedResponse.ts
import type { Team } from "./Team";

export interface TeamsPaginatedResponse {
  items: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
