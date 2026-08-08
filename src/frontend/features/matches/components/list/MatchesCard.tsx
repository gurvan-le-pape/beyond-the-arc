// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useLocale, useTranslations } from "next-intl";
import React from "react";

import {
  ClubLogo,
  EntityCardBadges,
  getLevelConfig,
  ListEntityCard,
  MatchScore,
} from "@/shared/components/domain";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, formatMatchDate, formatMatchTime } from "@/shared/utils";

import type { Match } from "../../types";

export const MatchesCard: React.FC<{ match: Match }> = ({ match }) => {
  const tMatches = useTranslations("matches");
  const locale = useLocale();

  const level = match.pool?.championship?.level;
  const config = getLevelConfig(level);
  const { homeTeamScore, awayTeamScore } = match;
  const hasScore = homeTeamScore !== null && awayTeamScore !== null;

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
            {formatMatchDate(match.date, locale)}
            {/* Punctuation, not content: a screen reader would otherwise
                read "12 October, bullet, 20:00". */}
            <span aria-hidden="true"> • </span>
            {formatMatchTime(match.date, locale)}
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
          poolLabel={match.pool?.name}
          level={level}
        />
      }
    >
      {/* Match Content */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <ClubLogo
              clubName={match.homeTeam?.club?.name}
              alt={match.homeTeam?.club?.name || tMatches("matchesTable.club")}
            />
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && homeTeamScore > awayTeamScore
                    ? "font-bold text-text-heading"
                    : "font-normal text-text-emphasis",
                )}
              >
                {match.homeTeam?.club?.name}
                {!!match.homeTeam?.number && ` - ${match.homeTeam.number}`}
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="flex-shrink-0 text-center">
            <MatchScore
              homeScore={homeTeamScore}
              awayScore={awayTeamScore}
              variant="list"
            />
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <ClubLogo
              clubName={match.awayTeam?.club?.name}
              alt={match.awayTeam?.club?.name || tMatches("matchesTable.club")}
            />
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && awayTeamScore > homeTeamScore
                    ? "font-bold text-text-heading"
                    : "font-normal text-text-emphasis",
                )}
              >
                {match.awayTeam?.club?.name}
                {!!match.awayTeam?.number && ` - ${match.awayTeam.number}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ListEntityCard>
  );
};

export default MatchesCard;
