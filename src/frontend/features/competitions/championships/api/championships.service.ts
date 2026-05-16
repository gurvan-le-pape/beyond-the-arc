// src/frontend/features/competitions/championships/api/championships.service.ts
import type { PaginatedResponse } from "@/shared/types";

import apiClient from "../../../../lib/services/client/api-client";
import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";

export const championshipService = {
  async getAll(
    filters?: ChampionshipFilters,
  ): Promise<PaginatedResponse<Championship>> {
    const { data } = await apiClient.get<PaginatedResponse<Championship>>(
      "/championships",
      {
        params: {
          level: filters?.level,
          id: filters?.id,
          category: filters?.category,
          gender: filters?.gender,
          page: filters?.page,
          limit: filters?.limit,
        },
      },
    );
    return data;
  },

  async getById(id: number): Promise<Championship> {
    const { data } = await apiClient.get<Championship>(`/championships/${id}`);
    return data;
  },
};
