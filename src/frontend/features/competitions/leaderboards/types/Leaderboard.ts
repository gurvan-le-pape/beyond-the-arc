// src/frontend/features/competitions/leaderboards/types/Leaderboard.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Leaderboard entry, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Leaderboard = components["schemas"]["LeaderboardResponseDto"];
