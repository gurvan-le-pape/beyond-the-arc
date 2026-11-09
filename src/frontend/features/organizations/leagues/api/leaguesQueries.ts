// src/frontend/features/organizations/leagues/api/leaguesQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import { leaguesService } from "./leagues.service";
import { leaguesKeys } from "./leaguesKeys";

/**
 * Global query configuration for leagues feature.
 * Centralizes cache timing and behavior policies.
 */
const LEAGUES_CONFIG = {
  /**
   * League data (names, regions) is among the most stable in the app —
   * changes are rare and administrative, not match-driven.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Leagues are reference data loaded early and reused across many
   * features (committees, clubs, championships), so a generous gcTime
   * avoids redundant fetches during deep navigation sessions.
   */
  gcTime: 15 * 60 * 1000,
} as const;

/**
 * Query options for every leagues request: key, fetcher and cache policy in
 * one object, spread by the hooks in `useLeagues.ts`, so call sites cannot
 * disagree on any of the three. The pattern is described in
 * `docs/frontend.md`.
 */
export const leaguesQueries = {
  /**
   * Query options for fetching all leagues.
   *
   * Keyed on the `lists()` rung even though the list takes no filters. Keying
   * it on `all` — the tempting reading of "there are no filters" — puts it
   * *above* the rung, so `invalidateQueries({ queryKey: leaguesKeys.lists() })`
   * would miss it. Every feature keys its list this way.
   *
   * @example
   * useQuery(leaguesQueries.list())
   *
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: () => ({
    queryKey: leaguesKeys.lists(),
    queryFn: ({ signal }: QueryFunctionContext) =>
      leaguesService.getAll(signal),
    ...LEAGUES_CONFIG,
  }),
} as const;
