// src/frontend/features/matches/components/list/matches-filters/useMatchesCascadeOptions.ts
import { useChampionships } from "@/features/competitions/championships/api";
import type { ChampionshipFilters } from "@/features/competitions/championships/types";
import type { MatchesFilterValues } from "@/features/matches/hooks";
import { CompetitionLevel } from "@/shared/constants";

/**
 * Supplies the division and pool options for the matches filter cascade, based
 * on the level and location already chosen.
 *
 * **No query runs until the scope is complete** — departmental with a committee,
 * or regional with a league. National level and half-filled scopes fetch
 * nothing and yield empty lists, which is why the caller must gate those steps
 * rather than treat empty as "none exist".
 *
 * Divisions span every championship in the scope. Pools are those of the one
 * championship the division, category and gender name together, and are empty
 * until all three are chosen: championships in one division share pool
 * letters, so a pool option is only meaningful inside its championship.
 *
 * @param filters - the category, gender, level, location and division
 *   currently selected
 * @returns championships, divisions, pools, and the error/retry pair
 */
export function useMatchesCascadeOptions({
  category,
  gender,
  level,
  committee: committeeId,
  league: leagueId,
  division,
}: Pick<
  MatchesFilterValues,
  "category" | "gender" | "level" | "committee" | "league" | "division"
>) {
  const isDepartmental =
    level === CompetitionLevel.DEPARTMENTAL && committeeId !== undefined;
  const isRegional =
    level === CompetitionLevel.REGIONAL && leagueId !== undefined;

  let championshipsFilter: ChampionshipFilters | undefined;
  if (isDepartmental) {
    championshipsFilter = { level: CompetitionLevel.DEPARTMENTAL, committeeId };
  } else if (isRegional) {
    championshipsFilter = { level: CompetitionLevel.REGIONAL, leagueId };
  }

  const { data, isError, refetch } = useChampionships(
    { ...championshipsFilter, limit: 100 },
    { enabled: isDepartmental || isRegional },
  );
  const championships = data?.items ?? [];

  const divisions = Array.from(
    new Set(
      championships
        .map((c) => c.division)
        .filter((d) => d !== null && d !== undefined),
    ),
  ).sort((a, b) => a - b);

  const championship = championships.find(
    (c) =>
      c.division === division && c.category === category && c.gender === gender,
  );
  const pools = [...(championship?.pools ?? [])].sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );

  // Reported so the caller can distinguish "this scope has no divisions" from
  // "the lookup failed" — both produce empty dropdowns otherwise. `retry` is
  // what turns the failure into something the user can act on.
  return { championships, divisions, pools, isError, retry: refetch };
}
