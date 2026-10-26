// src/frontend/features/matches/components/list/matches-by-round/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import type { Match } from "@/features/matches/types";
import { getCurrentRound, getSortedRounds } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { groupBy } from "@/shared/utils";

import { MatchesSection } from "./MatchesSection";
import { RoundSelector } from "./RoundSelector";

interface MatchesByRoundProps {
  readonly matches: Match[];
}

/**
 * Match panel for one pool: the round selector and the matches of the round,
 * under a section title like the standings' beside it. The selector sits
 * inside the frame rather than beside the title, which keeps the two title
 * rows the same height.
 *
 * Client-side for its own state — which round is selected, which rows are
 * expanded — but not for its data. The page already knows the pool, so it
 * fetches the matches on the server and passes them in; a pool switch is a
 * `?pool=` navigation that re-renders the page with a new list.
 *
 * Mounted with `key={poolId}` by the page, so that switch remounts this and the
 * selected round falls back to the current round of the new pool.
 */
export function MatchesByRound({ matches }: MatchesByRoundProps) {
  const t = useTranslations("competitions");
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
    <Section title={t("matchesLabel")}>
      {/* No padding of its own: the list runs edge to edge, its rules and
          date headings across the card's full width. */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex justify-center p-3">
          <RoundSelector
            rounds={getSortedRounds(groupedMatches)}
            selectedRound={selectedRound}
            onSelect={setRound}
          />
        </div>

        <MatchesSection
          currentMatches={currentMatches}
          expandedMatchIds={expandedMatchIds}
          onToggleExpand={toggleExpand}
        />
      </Card>
    </Section>
  );
}

export default MatchesByRound;
