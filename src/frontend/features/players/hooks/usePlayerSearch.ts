// src/frontend/features/players/hooks/usePlayerSearch.ts
import { useEffect, useRef, useState } from "react";

import { playersService } from "../api";
import type { Player } from "../types/Player";

interface UsePlayerSearchOptions {
  /** Player id to exclude from results (i.e. the one already on the page). */
  excludeId?: number;
  /** How long to wait after the user stops typing before firing the request. */
  debounceMs?: number;
  /** Minimum query length before a request is fired. */
  minLength?: number;
}

interface UsePlayerSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: Player[];
  isLoading: boolean;
}

/**
 * Debounced player search.
 *
 * Usage:
 *   const { query, setQuery, results, isLoading } = usePlayerSearch({ excludeId: 42 });
 */
export function usePlayerSearch({
  excludeId,
  debounceMs = 300,
  minLength = 2,
}: UsePlayerSearchOptions = {}): UsePlayerSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timeout on every keystroke.
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Below minimum length → clear results immediately, no request.
    if (query.trim().length < minLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    function fetchPlayers() {
      playersService
        .search(query.trim())
        .then((players) => {
          setResults(
            excludeId ? players.filter((p) => p.id !== excludeId) : players,
          );
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    timeoutRef.current = setTimeout(fetchPlayers, debounceMs);

    // Cleanup on unmount or next effect run.
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, excludeId, debounceMs, minLength]);

  return { query, setQuery, results, isLoading };
}
