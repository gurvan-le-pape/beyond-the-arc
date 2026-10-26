// src/frontend/features/matches/components/list/matches-by-round/MatchesSection.tsx
import { useLocale, useTranslations } from "next-intl";

import type { Match } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";
import { formatMatchDayTime, groupBy } from "@/shared/utils";

import { MatchRow } from "./match-row";

interface MatchesSectionProps {
  readonly currentMatches: Match[];
  readonly expandedMatchIds: number[];
  readonly onToggleExpand: (matchId: number) => void;
}

/**
 * The fixtures of the selected matchday, as one list: a heading for each
 * start time, and under it the matches that start then. A matchday is usually
 * played at a single time, so the date reads once instead of on every match.
 *
 * Expansion state is **a list of ids held by the parent**, not per-row state,
 * so more than one match can be open at once and the set survives changing
 * matchday. Wiring `onToggleExpand` to local state instead would collapse
 * everything on every re-render.
 */
export function MatchesSection({
  currentMatches,
  expandedMatchIds,
  onToggleExpand,
}: MatchesSectionProps) {
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (currentMatches.length === 0) {
    return (
      <Text variant="caption" className="block py-8 text-center">
        {tCommon("matchHistory.noMatches")}
      </Text>
    );
  }

  const byStart = Object.entries(
    groupBy(currentMatches, (match) => match.startsAt),
  ).sort(([a], [b]) => Date.parse(a) - Date.parse(b));

  return (
    <div className="divide-y divide-divide border-t border-divide">
      {byStart.map(([startsAt, matches]) => (
        <section key={startsAt}>
          <h4 className="border-b border-divide bg-surface-subtle px-4 py-2 text-sm font-semibold text-text-secondary">
            <time dateTime={startsAt}>
              {formatMatchDayTime(startsAt, locale)}
            </time>
          </h4>
          <ul className="divide-y divide-divide">
            {matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                expanded={expandedMatchIds.includes(match.id)}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
