// src/frontend/features/search/components/quick-search/useQuickSearch.ts
import { useQuery } from "@tanstack/react-query";

import { clubsQueries } from "@/features/organizations/clubs/api";
import { playersQueries } from "@/features/players/api";
import { teamsQueries } from "@/features/teams/api";
import { useDebounce } from "@/shared/hooks";

/** Shorter terms match too much to be worth a request. */
const MIN_LENGTH = 2;

/** Rows per group: the palette is for jumping, Explore is for browsing. */
const PER_GROUP = 4;

/**
 * The name-search tier of docs/frontend.md's cache table, the one the clubs
 * and players autocompletes use: a result set is consulted once and rarely
 * returned to. The list queries below would otherwise keep their 5-minute
 * list window.
 */
const NAME_SEARCH_CACHE = { staleTime: 60 * 1000, gcTime: 2 * 60 * 1000 };

/**
 * The quick search's data: the typed term, debounced, sent to the clubs, teams
 * and players list endpoints at once, a few rows each.
 *
 * Each group is its own query, so one slow or failing endpoint does not hold
 * back the other two: a group shows as soon as it has rows. The search
 * matches names the way Explore does (teams by their club's name), case- but
 * not accent-insensitively.
 *
 * @param term - what the reader has typed, as typed
 * @returns the term the results answer, the three groups, and their state
 */
export function useQuickSearch(term: string) {
  const query = useDebounce(term.trim(), 250);
  const enabled = query.length >= MIN_LENGTH;
  const params = { search: query, limit: PER_GROUP, page: 1 };

  const clubs = useQuery({
    ...clubsQueries.list(params),
    ...NAME_SEARCH_CACHE,
    enabled,
  });
  const teams = useQuery({
    ...teamsQueries.list(params),
    ...NAME_SEARCH_CACHE,
    enabled,
  });
  const players = useQuery({
    ...playersQueries.list(params),
    ...NAME_SEARCH_CACHE,
    enabled,
  });
  const all = [clubs, teams, players];

  return {
    query,
    enabled,
    clubs: clubs.data?.items ?? [],
    teams: teams.data?.items ?? [],
    players: players.data?.items ?? [],
    isLoading: enabled && all.some((result) => result.isLoading),
    isError: enabled && all.every((result) => result.isError),
  };
}
