// src/frontend/features/organizations/clubs/hooks/useSearch.tsx
import { useCallback, useMemo, useState } from "react";

import type { ClubBasic } from "../types/ClubBasic";

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
 */
export function useSearch(clubs: ClubBasic[]): UseSearchReturn {
  const [query, setQuery] = useState("");

  const isSearching = query.length > 0;

  // Search across multiple fields
  const results = useMemo(() => {
    if (!query.trim()) return clubs;

    const normalizedQuery = query.toLowerCase().trim();

    return clubs.filter((club) => {
      const nameMatch = club.name.toLowerCase().includes(normalizedQuery);
      const cityMatch = club.city?.toLowerCase().includes(normalizedQuery);
      const zipMatch = club.zipCode?.includes(normalizedQuery);

      return nameMatch || cityMatch || zipMatch;
    });
  }, [clubs, query]);

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
