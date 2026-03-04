// src/frontend/features/players/types/PlayersPaginatedResponse.ts
import type { Player } from "./Player";

export interface PlayersPaginatedResponse {
  items: Player[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
