// src/frontend/features/competitions/championships/components/detail/matches/MatchesPanel.tsx
"use client";

import { useTranslations } from "next-intl";

import { getSortedRounds } from "@/features/matches/utils";
import { Badge, Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import RoundSelector from "../navigation/RoundSelector";
import MatchCard from "./MatchCard";

interface MatchesPanelProps {
  readonly groupedMatches: Record<number, any[]>;
  readonly selectedRound: number | null;
  readonly onSelectRound: (round: number) => void;
  readonly expandedMatchIds: number[];
  readonly onToggleExpand: (matchId: number) => void;
}

export function MatchesPanel({
  groupedMatches,
  selectedRound,
  onSelectRound,
  expandedMatchIds,
  onToggleExpand,
}: MatchesPanelProps) {
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const currentMatches = selectedRound ? groupedMatches[selectedRound] : [];

  return (
    <Card
      variant="highlighted"
      padding="sm"
      className="sticky top-20 lg:top-24"
    >
      <div className="space-y-4">
        {/* Rounds Section */}
        <div>
          <Text variant="h3" className="mb-3">
            {tCompetitions("roundsLabel")}
          </Text>
          <RoundSelector
            rounds={getSortedRounds(groupedMatches)}
            selectedRound={selectedRound}
            onSelect={onSelectRound}
            className="mb-0"
          />
        </div>

        {/* Matches Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Text variant="h3">{tCompetitions("matchesLabel")}</Text>
            {currentMatches && currentMatches.length > 0 && (
              <Badge variant="primary" size="sm">
                {currentMatches.length}
              </Badge>
            )}
          </div>
          <div className="space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent">
            {currentMatches && currentMatches.length > 0 ? (
              currentMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  expanded={expandedMatchIds.includes(match.id)}
                  onToggleExpand={onToggleExpand}
                />
              ))
            ) : (
              <Text variant="caption" className="text-center py-8">
                {tCommon("matchHistory.noMatches")}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MatchesPanel;
