// src/frontend/features/geography/api/geometriesKeys.ts
export const geometriesKeys = {
  all: ["geometries"] as const,
  regions: () => [...geometriesKeys.all, "regions"] as const,
  departments: () => [...geometriesKeys.all, "departments"] as const,
};
