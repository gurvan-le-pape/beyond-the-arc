// src/backend/common/utils/championship-filter.util.ts
import type { Category, CompetitionLevel, Gender } from "@common/constants";

/**
 * Query params selecting championships by what they are rather than by id.
 */
export interface ChampionshipScopeFilters {
  level?: CompetitionLevel;
  division?: number;
  category?: Category;
  gender?: Gender;
}

/**
 * Championship where fragment holding the filters that were provided.
 * Structurally assignable to Prisma.ChampionshipsWhereInput; callers embed it
 * through their own join path.
 *
 * @param filters - any object carrying these filters; other fields are ignored
 * @returns the fragment, or undefined when no filter was provided
 */
export function buildChampionshipWhere(
  filters: ChampionshipScopeFilters,
): ChampionshipScopeFilters | undefined {
  const where: ChampionshipScopeFilters = {};

  if (filters.level) where.level = filters.level;
  if (filters.division) where.division = filters.division;
  if (filters.category) where.category = filters.category;
  if (filters.gender) where.gender = filters.gender;

  return Object.keys(where).length > 0 ? where : undefined;
}
