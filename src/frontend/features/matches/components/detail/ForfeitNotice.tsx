// src/frontend/features/matches/components/detail/ForfeitNotice.tsx
import { Flag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

import type { MatchTeam } from "../../types/MatchTeam";
import { forfeitSides } from "../../utils/forfeitSides";

interface ForfeitNoticeProps {
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
}

/**
 * Stands in for the stats and events of a forfeited match, which was never
 * played: it has neither.
 */
export function ForfeitNotice({ homeTeam, awayTeam }: ForfeitNoticeProps) {
  const tMatches = useTranslations("matches");
  const { forfeiting, winner } = forfeitSides(homeTeam, awayTeam);

  return (
    <Section title={tMatches("forfeitNotice.title")}>
      <div className="flex items-start gap-3">
        <Flag
          className="w-5 h-5 mt-0.5 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
        <Text variant="body">
          {tMatches("forfeitNotice.body", {
            team: forfeiting.name,
            winner: winner.name,
            score: `${winner.score}–${forfeiting.score}`,
          })}
        </Text>
      </div>
    </Section>
  );
}
