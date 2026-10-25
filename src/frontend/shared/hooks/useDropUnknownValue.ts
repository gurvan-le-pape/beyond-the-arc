// src/frontend/shared/hooks/useDropUnknownValue.ts
"use client";

import { useEffect } from "react";

/**
 * Clears a selected value that its option list does not contain — a stale or
 * hand-edited link such as `?league=999` — so the filter applied to the list
 * and the picker showing it agree.
 *
 * Waits for `isLoaded`: before the options arrive every value is unknown, and
 * clearing then would wipe the filter a deep link asked for.
 *
 * @param value - the selected value, `undefined` when none is
 * @param knownValues - the values the option list offers
 * @param isLoaded - whether `knownValues` is the loaded list for this selection
 * @param clear - removes the value, e.g. a filter setter called with `undefined`
 */
export function useDropUnknownValue<T>(
  value: T | undefined,
  knownValues: readonly T[],
  isLoaded: boolean,
  clear: () => void,
) {
  const isUnknown =
    isLoaded && value !== undefined && !knownValues.includes(value);

  useEffect(() => {
    if (isUnknown) clear();
  }, [isUnknown, clear]);
}
