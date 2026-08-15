// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/MatchExpandedSection.tsx
import { useTranslations } from "next-intl";

import type { Match, MatchEvent } from "@/features/matches/types";
import { ErrorMessage } from "@/shared/components/feedback";

import MatchDetailsTable from "./MatchDetailsTable";

interface MatchExpandedSectionProps {
  readonly match: Match;
  readonly matchEvents: MatchEvent[];
  readonly isLoadingEvents: boolean;
  readonly hasError: boolean;
  readonly onRetryEvents: () => unknown;
}

export function MatchExpandedSection({
  match,
  matchEvents,
  isLoadingEvents,
  hasError,
  onRetryEvents,
}: MatchExpandedSectionProps) {
  const tCommon = useTranslations("common");

  return (
    <div className="mt-3 pt-3 border-t border-divide animate-slide-down">
      {hasError ? (
        <ErrorMessage
          message={tCommon("errors.fetchMatchEvents")}
          onRetry={onRetryEvents}
        />
      ) : (
        <MatchDetailsTable
          match={match}
          matchEvents={matchEvents}
          isLoadingEvents={isLoadingEvents}
        />
      )}
    </div>
  );
}
