// src/frontend/features/competitions/components/matches/MatchesPanel.tsx
"use client";

import { useTranslations } from "next-intl";

import { RoundSelector } from "@/features/competitions/components";
import { getSortedRounds } from "@/features/matches/utils/getSortedRounds";
import { Badge, Card } from "@/shared/components/ui";

import MatchCard from "./MatchCard";

interface MatchesPanelProps {
  groupedMatches: Record<number, any[]>;
  selectedRound: number | null;
  onSelectRound: (round: number) => void;
  expandedMatchIds: number[];
  onToggleExpand: (matchId: number) => void;
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
    <Card padding="sm" className="sticky top-20 lg:top-24">
      <div className="space-y-4">
        {/* Rounds Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {tCompetitions("roundsLabel")}
          </h3>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {tCompetitions("matchesLabel")}
            </h3>
            {currentMatches && currentMatches.length > 0 && (
              <Badge variant="primary" size="sm">
                {currentMatches.length}
              </Badge>
            )}
          </div>
          <div className="space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
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
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                {tCommon("matchHistory.noMatches")}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default MatchesPanel;
