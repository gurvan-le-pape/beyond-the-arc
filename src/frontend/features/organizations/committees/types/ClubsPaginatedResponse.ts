// src/frontend/features/organizations/committees/types/ClubsPaginatedResponse.ts
import type { ClubBasic } from "../../clubs/types/ClubBasic";

export interface ClubsPaginatedResponse {
  items: ClubBasic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
