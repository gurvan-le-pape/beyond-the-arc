// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useLocale, useTranslations } from "next-intl";

import {
  EntityCardBadges,
  getLevelConfig,
  ListEntityCard,
  Matchup,
} from "@/shared/components/domain";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, formatMatchDate, formatMatchTime } from "@/shared/utils";

import type { Match } from "../../types";
import { matchupSide } from "../../utils";

interface MatchesCardProps {
  readonly match: Match;
}

/**
 * One match in a list: date and time, matchday badge, the two clubs, and the
 * score once there is one.
 *
 * Championship data is optional-chained throughout, since list responses do not
 * always carry the pool and its championship; the badges and the level accent
 * fall back to neutral rather than failing.
 */
export function MatchesCard({ match }: MatchesCardProps) {
  const tMatches = useTranslations("matches");
  const tTeams = useTranslations("teams");
  const locale = useLocale();

  const level = match.pool?.championship?.level;
  const config = getLevelConfig(level);

  return (
    <ListEntityCard
      href={`/matches/${match.id}`}
      ariaLabel={tMatches("ariaLabelMatch", {
        home: match.homeTeam?.club?.name || "",
        away: match.awayTeam?.club?.name || "",
      })}
      level={level}
      headerLeft={
        <div className="flex items-center gap-2">
          <Text variant="label" className={cn("font-semibold", config.text)}>
            {formatMatchDate(match.startsAt, locale)}
            {/* Punctuation, not content: a screen reader would otherwise
                read "12 October, bullet, 20:00". */}
            <span aria-hidden="true"> • </span>
            {formatMatchTime(match.startsAt, locale)}
          </Text>
          <Badge variant="default" size="sm">
            {tMatches("matchdayLabel", { matchday: match.matchday })}
          </Badge>
        </div>
      }
      badges={
        <EntityCardBadges
          category={match.pool?.championship?.category}
          gender={match.pool?.championship?.gender}
          division={match.pool?.championship?.division}
          poolLabel={
            match.pool
              ? tTeams("poolLabel", { letter: match.pool.letter })
              : null
          }
          level={level}
        />
      }
    >
      <div className="px-5 py-4">
        <Matchup
          home={matchupSide(match.homeTeam, match.homeTeamScore)}
          away={matchupSide(match.awayTeam, match.awayTeamScore)}
          size="card"
        />
      </div>
    </ListEntityCard>
  );
}

export default MatchesCard;
