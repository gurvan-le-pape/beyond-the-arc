// src/frontend/features/players/types/PlayerSearchFilters.ts
import type { PlayerFilters } from "./PlayerFilters";

/**
 * The subset of player filters that scopes a name search server-side.
 *
 * `excludeId` is deliberately absent: it never reaches the API, it only drops
 * one already-fetched row, so it belongs in the hook's `select` rather than in
 * the request or the query key.
 */
export type PlayerSearchFilters = Pick<PlayerFilters, "gender" | "category">;
