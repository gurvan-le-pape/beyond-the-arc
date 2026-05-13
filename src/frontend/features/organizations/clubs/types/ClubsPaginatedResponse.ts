// src/frontend/features/organizations/clubs/types/ClubsPaginatedResponse.ts
import type { ClubBasic } from "./ClubBasic";

export interface ClubsPaginatedResponse {
  items: ClubBasic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
