// src/frontend/features/competitions/championships/components/detail/championship-matches/index.tsx
"use client";

import { useMemo, useState } from "react";

import { useMatchesByPool } from "@/features/matches/api";
import { getSortedRounds } from "@/features/matches/utils";
import { Card } from "@/shared/components/primitives";
import { groupBy } from "@/shared/utils";

import { MatchesSection } from "./MatchesSection";
import { RoundsSection } from "./RoundsSection";

interface ChampionshipMatchesProps {
  readonly poolId: number;
}

/**
 * Match panel for one pool: the round selector and the cards of the round.
 *
 * Mounted with `key={poolId}` by the page, so a pool switch remounts it and
 * the selected round falls back to the first round of the new pool.
 */
export function ChampionshipMatches({ poolId }: ChampionshipMatchesProps) {
  const { data: matches = [] } = useMatchesByPool(poolId);

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
