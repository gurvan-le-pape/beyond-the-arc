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
 * Two details shape the result. Championships are fetched with a **hard limit of
 * 100**, so a scope larger than that silently offers incomplete divisions. And
 * pools are **deduplicated by letter, keeping whichever has the most
 * matchdays** — several championships in one scope can share a letter, and the
 * longest is taken as representative.
 *
 * @param filters - the level, location and division currently selected
 * @returns championships, divisions, pools, and the error/retry pair
 */
export function useMatchesCascadeOptions({
  level,
  committee: committeeId,
  league: leagueId,
  division,
}: Pick<MatchesFilterValues, "level" | "committee" | "league" | "division">) {
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

  const poolsByLetter = championships
    .filter((c) => c.division === division)
    .flatMap((c) => c.pools)
    .reduce<
      Map<
        string,
        { id: number; letter: string; name: string; nbMatchdays: number }
      >
    >((acc, p) => {
      const existing = acc.get(p.letter);
      if (!existing || p.nbMatchdays > existing.nbMatchdays) {
        acc.set(p.letter, p);
      }
      return acc;
    }, new Map());

  const pools = Array.from(poolsByLetter.values()).sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );

  // Reported so the caller can distinguish "this scope has no divisions" from
  // "the lookup failed" — both produce empty dropdowns otherwise. `retry` is
  // what turns the failure into something the user can act on.
  return { championships, divisions, pools, isError, retry: refetch };
}
