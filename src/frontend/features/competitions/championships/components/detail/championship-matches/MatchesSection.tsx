// src/frontend/features/competitions/championships/components/detail/championship-matches/MatchesSection.tsx
import { useTranslations } from "next-intl";

import type { Match } from "@/features/matches/types";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import { MatchCard } from "./match-card";

interface MatchesSectionProps {
  readonly currentMatches: Match[];
  readonly expandedMatchIds: number[];
  readonly onToggleExpand: (matchId: number) => void;
}

export function MatchesSection({
  currentMatches,
  expandedMatchIds,
  onToggleExpand,
}: MatchesSectionProps) {
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Text variant="h3">{tCompetitions("matchesLabel")}</Text>
        {currentMatches.length > 0 && (
          <Badge variant="primary" size="sm">
            {currentMatches.length}
          </Badge>
        )}
      </div>
      <div className="space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1 scrollbar-thin">
        {currentMatches.length > 0 ? (
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
  );
}
