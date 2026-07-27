// src/frontend/features/competitions/championships/components/detail/championship-matches/index.tsx
"use client";

import { useMemo, useState } from "react";

import type { Match } from "@/features/matches/types";
import { getSortedRounds } from "@/features/matches/utils";
import { Card } from "@/shared/components/primitives";
import { groupBy } from "@/shared/utils";

import { MatchesSection } from "./MatchesSection";
import { RoundsSection } from "./RoundsSection";

interface ChampionshipMatchesProps {
  readonly matches: Match[];
}

/**
 * Match panel for one pool: the round selector and the cards of the round.
 *
 * Client-side for its own state — which round is selected, which cards are
 * expanded — but not for its data. The page already knows the pool, so it
 * fetches the matches on the server and passes them in; a pool switch is a
 * `?pool=` navigation that re-renders the page with a new list.
 *
 * Mounted with `key={poolId}` by the page, so that switch remounts this and the
 * selected round falls back to the first round of the new pool.
 */
export function ChampionshipMatches({ matches }: ChampionshipMatchesProps) {
  const groupedMatches = useMemo(
    () => groupBy(matches, (match) => match.matchday),
    [matches],
  );

  const [round, setRound] = useState<number | null>(null);
  const selectedRound = round ?? getSortedRounds(groupedMatches)[0] ?? null;

  const [expandedMatchIds, setExpandedMatchIds] = useState<number[]>([]);

  const toggleExpand = (matchId: number) => {
    setExpandedMatchIds((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId],
    );
  };

  const currentMatches = selectedRound ? groupedMatches[selectedRound] : [];

  return (
    <Card variant="highlighted" padding="sm" className="sticky top-20 lg:top-24">
      <div className="space-y-4">
        {/* Rounds Section */}
        <RoundsSection
          groupedMatches={groupedMatches}
          selectedRound={selectedRound}
          onSelectRound={setRound}
        />

        {/* Matches Section */}
        <MatchesSection
          currentMatches={currentMatches}
          expandedMatchIds={expandedMatchIds}
          onToggleExpand={toggleExpand}
        />
      </div>
    </Card>
  );
}

export default ChampionshipMatches;
