// src/frontend/shared/types/PlayerMatchStats.ts
import type { components } from "./api.generated";

/**
 * Per-match player statistics, generated from the backend OpenAPI
 * document (the players/teams history flavor — no playtime field; the
 * matches flavor with playtime is PlayerStatsDto). Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type PlayerMatchStats = components["schemas"]["PlayerMatchStatsDto"];
