// src/frontend/features/matches/hooks/useMatchesCascadeOptions.ts
import { useChampionships } from "@/features/competitions/championships/api";
import { CompetitionLevel } from "@/shared/constants";

import type { MatchesFilterState } from "./useMatchesFilterState";

export function useMatchesCascadeOptions({
  level,
  committeeId,
  leagueId,
  division,
}: Pick<
  MatchesFilterState,
  "level" | "committeeId" | "leagueId" | "division"
>) {
  const isDepartmental =
    level === CompetitionLevel.DEPARTMENTAL && committeeId !== undefined;
  const isRegional =
    level === CompetitionLevel.REGIONAL && leagueId !== undefined;

  let championshipsFilter: { level: CompetitionLevel; id: number } | undefined;
  if (isDepartmental) {
    championshipsFilter = {
      level: CompetitionLevel.DEPARTMENTAL,
      id: committeeId,
    };
  } else if (isRegional) {
    championshipsFilter = { level: CompetitionLevel.REGIONAL, id: leagueId };
  }

  const { data: championships = [] } = useChampionships(championshipsFilter, {
    enabled: isDepartmental || isRegional,
  });

  const divisions = Array.from(
    new Set(
      championships
        .map((c) => c.division)
        .filter((d) => d !== null && d !== undefined),
    ),
  ).sort((a, b) => a - b);

  const poolsByLetter = championships
    .filter((c) => String(c.division) === String(division))
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

  return { championships, divisions, pools };
}
