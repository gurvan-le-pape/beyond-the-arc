// src/frontend/features/matches/components/list/matches-by-round/index.tsx
"use client";

import { useMemo, useState } from "react";

import type { Match } from "@/features/matches/types";
import { getCurrentRound } from "@/features/matches/utils";
import { Card } from "@/shared/components/primitives";
import { groupBy } from "@/shared/utils";

import { MatchesSection } from "./MatchesSection";
import { RoundsSection } from "./RoundsSection";

interface MatchesByRoundProps {
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
 * selected round falls back to the current round of the new pool.
 */
export function MatchesByRound({ matches }: MatchesByRoundProps) {
  const groupedMatches = useMemo(
    () => groupBy(matches, (match) => match.matchday),
    [matches],
  );

  const [round, setRound] = useState<number | null>(null);
  const selectedRound = round ?? getCurrentRound(groupedMatches);

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
    <Card padding="sm">
      <div className="space-y-4">
        <RoundsSection
          groupedMatches={groupedMatches}
          selectedRound={selectedRound}
          onSelectRound={setRound}
        />

        <MatchesSection
          currentMatches={currentMatches}
          expandedMatchIds={expandedMatchIds}
          onToggleExpand={toggleExpand}
        />
      </div>
    </Card>
  );
}

export default MatchesByRound;
