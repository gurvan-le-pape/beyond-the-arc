// src/frontend/features/competitions/championships/components/detail/championship-matches/index.tsx
"use client";

import { Card } from "@/shared/components/primitives";

import { MatchesSection } from "./MatchesSection";
import { RoundsSection } from "./RoundsSection";

interface ChampionshipMatchesProps {
  readonly groupedMatches: Record<number, any[]>;
  readonly selectedRound: number | null;
  readonly onSelectRound: (round: number) => void;
  readonly expandedMatchIds: number[];
  readonly onToggleExpand: (matchId: number) => void;
}

export function ChampionshipMatches({
  groupedMatches,
  selectedRound,
  onSelectRound,
  expandedMatchIds,
  onToggleExpand,
}: ChampionshipMatchesProps) {
  const currentMatches = selectedRound ? groupedMatches[selectedRound] : [];

  return (
    <Card
      variant="highlighted"
      padding="sm"
      className="sticky top-20 lg:top-24"
    >
      <div className="space-y-4">
        {/* Rounds Section */}
        <RoundsSection
          groupedMatches={groupedMatches}
          selectedRound={selectedRound}
          onSelectRound={onSelectRound}
        />

        {/* Matches Section */}
        <MatchesSection
          currentMatches={currentMatches}
          expandedMatchIds={expandedMatchIds}
          onToggleExpand={onToggleExpand}
        />
      </div>
    </Card>
  );
}

export default ChampionshipMatches;
