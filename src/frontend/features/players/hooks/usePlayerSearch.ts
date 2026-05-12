// src/frontend/features/players/hooks/usePlayerSearch.ts
import { useEffect, useState } from "react";

import { playersService } from "../api";
import type { Player } from "../types/Player";

interface UsePlayerSearchOptions {
  excludeId?: number;
  minLength?: number;
  gender?: string;
  category?: string;
}

interface UsePlayerSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: Player[];
  isLoading: boolean;
}

export function usePlayerSearch({
  excludeId,
  minLength = 2,
  gender,
  category,
}: UsePlayerSearchOptions = {}): UsePlayerSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < minLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    playersService
      .search(query.trim(), { excludeId, gender, category })
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  }, [query, excludeId, gender, category, minLength]);

  return { query, setQuery, results, isLoading };
}
