// src/frontend/features/competitions/pools/types/RecentPool.ts
import type { components } from "@/shared/types/api.generated";

/**
 * A pool that played in the most recent completed round, with the matchday it
 * played — generated from the backend OpenAPI document.
 */
export type RecentPool = components["schemas"]["RecentPoolResponseDto"];
