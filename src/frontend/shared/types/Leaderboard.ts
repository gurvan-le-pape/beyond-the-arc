// src/frontend/shared/types/Leaderboard.ts
import type { components } from "./api.generated";

/**
 * Leaderboard entry, generated from the backend OpenAPI document.
 * Lives here rather than in a feature because the shared LeaderboardTable
 * renders it; the identical feature-level alias stays for feature code.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Leaderboard = components["schemas"]["LeaderboardResponseDto"];
