// src/frontend/features/organizations/clubs/hooks/useFilters.tsx
import { useCallback, useMemo, useState } from "react";

import type { ClubBasic } from "../types/ClubBasic";

export interface ClubFilters {
  hasWebsite: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
}

interface UseFiltersReturn {
  filters: ClubFilters;
  toggleFilter: (key: keyof ClubFilters) => void;
  clearFilters: () => void;
  filteredClubs: ClubBasic[];
  activeFilterCount: number;
}

const DEFAULT_FILTERS: ClubFilters = {
  hasWebsite: false,
  hasEmail: false,
  hasPhone: false,
};

/**
 * Filter clubs based on available contact information
 */
export function useFilters(clubs: ClubBasic[]): UseFiltersReturn {
  const [filters, setFilters] = useState<ClubFilters>(DEFAULT_FILTERS);

  const toggleFilter = useCallback((key: keyof ClubFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  // Apply filters
  const filteredClubs = useMemo(() => {
    // If no filters active, return all clubs
    if (activeFilterCount === 0) return clubs;

    return clubs.filter((club) => {
      // All active filters must match (AND logic)
      if (filters.hasWebsite && !club.website) return false;
      if (filters.hasEmail && !club.email) return false;
      if (filters.hasPhone && !club.phone) return false;

      return true;
    });
  }, [clubs, filters, activeFilterCount]);

  return {
    filters,
    toggleFilter,
    clearFilters,
    filteredClubs,
    activeFilterCount,
  };
}
