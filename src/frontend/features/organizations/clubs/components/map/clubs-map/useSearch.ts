// src/frontend/features/organizations/clubs/components/map/clubs-map/useSearch.ts
import { useCallback, useMemo, useState } from "react";

import { normalizeString } from "@/shared/utils";

import type { ClubBasic } from "../../../types/ClubBasic";

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: ClubBasic[];
  isSearching: boolean;
  clearSearch: () => void;
}

/**
 * Multi-field search for clubs
 * Searches: club name, city, zip code
 *
 * Case- and accent-insensitive on both sides: most cities are stored without
 * accents ("EPINAL"), so "Épinal" has to match them, and "epinal" has to match
 * the few that keep theirs.
 *
 * @param clubs - every club, searched by name, city and zip code
 * @returns the query and its setter, the matching clubs (all of them while the
 *   query is blank), whether a query is typed, and a reset
 */
export function useSearch(clubs: ClubBasic[]): UseSearchReturn {
  const [query, setQuery] = useState("");

  const isSearching = query.length > 0;

  // Normalised once per club list, not once per keystroke.
  const searchIndex = useMemo(
    () =>
      clubs.map((club) => ({
        club,
        name: normalizeString(club.name),
        city: club.city ? normalizeString(club.city) : null,
      })),
    [clubs],
  );

  const results = useMemo(() => {
    if (!query.trim()) return clubs;

    const normalizedQuery = normalizeString(query.trim());

    return searchIndex
      .filter(
        ({ club, name, city }) =>
          name.includes(normalizedQuery) ||
          city?.includes(normalizedQuery) ||
          club.zipCode?.includes(normalizedQuery),
      )
      .map(({ club }) => club);
  }, [clubs, searchIndex, query]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  };
}
