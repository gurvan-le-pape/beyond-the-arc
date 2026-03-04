// src/frontend/features/matches/types/MatchesPaginatedResponse.ts
import type { Match } from "./Match";

export interface MatchesPaginatedResponse {
  items: Match[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
