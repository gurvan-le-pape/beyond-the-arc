// src/frontend/features/organizations/hooks/useLocationFilterState.ts
"use client";

import { useCallback, useState } from "react";

/**
 * The league/committee pair that scopes a filterable list.
 *
 * State only — it fetches nothing. The lists to choose from come from
 * `useLocationOptions`, which the filter component calls separately. Keeping
 * the two apart means the `use<X>FilterState` hooks (which want the state) and
 * the `<X>Filters` components (which want the options) do not each instantiate
 * both halves.
 *
 * @returns the committee and league ids, their setters, and a `resetFilters` that clears both
 */
export function useLocationFilterState() {
  const [committeeId, setCommitteeId] = useState<number | undefined>(undefined);
  const [leagueId, setLeagueId] = useState<number | undefined>(undefined);

  const resetFilters = useCallback(() => {
    setCommitteeId(undefined);
    setLeagueId(undefined);
  }, []);

  return {
    committeeId,
    setCommitteeId,
    leagueId,
    setLeagueId,
    resetFilters,
  };
}
