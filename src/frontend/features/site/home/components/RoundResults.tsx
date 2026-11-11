// src/frontend/features/site/home/components/RoundResults.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ForfeitBadge } from "@/features/matches/components";
import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { Matchup } from "@/shared/components/domain";
import { Card } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

/**
 * Results shown on a phone, where the cards stack one per row; wider screens
 * show the whole round.
 */
const PHONE_RESULTS = 3;

interface RoundResultsProps {
  /** The round's played matches, in display order. */
  readonly matches: Match[];
  /** The link beside the title, to the round's full results. */
  readonly action: ReactNode;
}

/**
 * One round's results as a grid of match cards, each linking to its match: two
 * columns from `sm` up, one on a phone, where only the first few show.
 */
export function RoundResults({ matches, action }: RoundResultsProps) {
  const t = useTranslations("home.latestRound");
  const tMatches = useTranslations("matches");

  return (
    <Section title={t("resultsTitle")} action={action}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {matches.map((match, index) => (
          <li
            key={match.id}
            className={cn(index >= PHONE_RESULTS && "max-sm:hidden")}
          >
            <Card
              href={`/matches/${match.id}`}
              padding="sm"
              aria-label={tMatches("ariaLabelMatch", {
                home: match.homeTeam.club.name,
                away: match.awayTeam.club.name,
              })}
            >
              <Matchup
                home={matchupSide(match.homeTeam, match.homeTeamScore)}
                away={matchupSide(match.awayTeam, match.awayTeamScore)}
                status={match.status}
                size="line"
              />
              {match.forfeit && <ForfeitBadge className="mt-2" />}
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
