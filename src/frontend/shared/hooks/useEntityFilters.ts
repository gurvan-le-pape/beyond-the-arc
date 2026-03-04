// src/frontend/shared/hooks/useEntityFilters.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function shallowEqual(objA: any, objB: any) {
  if (objA === objB) return true;
  if (!objA || !objB) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false;
  }
  return true;
}

type FilterType = "input" | "dropdown" | "searchableDropdown";

interface FilterConfig {
  [key: string]: {
    type: FilterType;
    debounceMs?: number;
    initial?: any;
  };
}

export function useEntityFilters(filterConfig: FilterConfig) {
  // Internal state for all filters (raw values)
  const [rawFilters, setRawFilters] = useState(() => {
    const initial: Record<string, any> = {};
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      initial[key] = cfg.initial ?? "";
    });
    return initial;
  });

  // Debounced state for input filters
  const [debouncedFilters, setDebouncedFilters] = useState(rawFilters);
  const debounceRefs = useRef<Record<string, NodeJS.Timeout | null>>({});

  // Debounced update logic extracted to reduce nesting
  function handleDebouncedUpdate(key: string, debounceMs: number) {
    if (debounceRefs.current[key]) clearTimeout(debounceRefs.current[key]);
    debounceRefs.current[key] = setTimeout(() => {
      // Only update if value actually changed
      if (debouncedFilters[key] !== rawFilters[key]) {
        setDebouncedFilters((prev) => {
          const next = { ...prev, [key]: rawFilters[key] };
          return shallowEqual(prev, next) ? prev : next;
        });
      }
    }, debounceMs);
  }

  // Debounce effect for input filters
  useEffect(() => {
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      if (cfg.type === "input" && cfg.debounceMs) {
        handleDebouncedUpdate(key, cfg.debounceMs);
      }
    });
    // Cleanup
    return () => {
      Object.values(debounceRefs.current).forEach(
        (ref) => ref && clearTimeout(ref),
      );
    };
  }, [rawFilters, filterConfig]);

  // For non-input filters, update debouncedFilters immediately, but only if changed
  useEffect(() => {
    let changed = false;
    const next = { ...debouncedFilters };
    Object.entries(filterConfig).forEach(([key, cfg]) => {
      if (cfg.type !== "input") {
        if (debouncedFilters[key] !== rawFilters[key]) {
          next[key] = rawFilters[key];
          changed = true;
        }
      }
    });
    if (changed && !shallowEqual(debouncedFilters, next)) {
      setDebouncedFilters(next);
    }
  }, [rawFilters]);

  // Generic prop-getters
  const getInputFilterProps = useCallback(
    (key: string) => ({
      value: rawFilters[key] ?? "",
      onChange: (e: any) => {
        const value = e?.target ? e.target.value : e;
        setRawFilters((prev) => ({ ...prev, [key]: value }));
      },
    }),
    [rawFilters],
  );

  const getDropdownFilterProps = useCallback(
    (key: string) => ({
      value: rawFilters[key] ?? "",
      onChange: (value: any) => {
        setRawFilters((prev) => ({ ...prev, [key]: value }));
      },
    }),
    [rawFilters],
  );

  const getSearchableDropdownFilterProps = useCallback(
    (key: string) => ({
      value: rawFilters[key] ?? "",
      onChange: (value: any) =>
        setRawFilters((prev) => ({ ...prev, [key]: value })),
    }),
    [rawFilters],
  );

  const resetFilters = useCallback(() => {
    setRawFilters(() => {
      const initial: Record<string, any> = {};
      Object.entries(filterConfig).forEach(([key, cfg]) => {
        initial[key] = cfg.initial ?? "";
      });
      return initial;
    });
  }, [filterConfig]);

  // Memoize filters object to prevent infinite loops in useEffect
  const filters = useMemo(() => debouncedFilters, [debouncedFilters]);
  return {
    filters,
    getInputFilterProps,
    getDropdownFilterProps,
    getSearchableDropdownFilterProps,
    resetFilters,
  };
}
