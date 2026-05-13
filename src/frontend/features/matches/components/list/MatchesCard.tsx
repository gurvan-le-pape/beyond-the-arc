// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { LEVEL_CONFIG } from "@/shared/constants";
import { cn, formatMatchDate, formatMatchTime, formatNameToFileName } from "@/shared/utils";

interface MatchesCardProps {
  match: any;
  onClick: (matchId: number) => void;
}

export const MatchesCard: React.FC<MatchesCardProps> = ({ match, onClick }) => {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const level = match.pool?.championship?.level?.toLowerCase() ?? "";
  const config =
    LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.default;
  const hasScore = match.homeTeamScore !== null && match.awayTeamScore !== null;

  return (
    <button
      type="button"
      onClick={() => onClick(match.id)}
      className={cn(
        "w-full text-left border-l-8 rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface",
        "surface-raised",
        config.border,
      )}
      aria-label={tMatches("ariaLabelMatch", {
        home: match.homeTeam?.club?.name || "",
        away: match.awayTeam?.club?.name || "",
      })}
    >
      {/* Header */}
      <div className={cn("px-6 py-3", config.bg)}>
        <div className="flex justify-between items-center flex-wrap gap-2">
          {/* Left: date, time, matchday */}
          <div className="flex items-center gap-3">
            <Text variant="label">
              {formatMatchDate(match.date)} • {formatMatchTime(match.date)}
            </Text>
            <Badge variant="default" size="sm">
              {tMatches("matchdayLabel", { matchday: match.matchday })}
            </Badge>
          </div>

          {/* Right: category, gender, division, pool, level */}
          <div className="flex items-center gap-2 flex-wrap">
            {match.pool?.championship?.category && (
              <Badge variant="outline" size="sm">
                {match.pool.championship.category}
              </Badge>
            )}
            {match.pool?.championship?.gender && (
              <Badge variant="outline" size="sm">
                {tCommon(
                  `gender.${match.pool.championship.gender.toLowerCase()}`,
                )}
              </Badge>
            )}
            {match.pool?.championship?.division && (
              <Badge variant="outline" size="sm">
                {`Div ${match.pool.championship.division}`}
              </Badge>
            )}
            {match.pool?.name && (
              <Badge variant="outline" size="sm">
                {match.pool.name}
              </Badge>
            )}
            {!!level && (
              <Badge variant={config.badgeVariant} size="sm">
                {tCommon(`competition.levels.${level}Short`)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Match Content */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between gap-6">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="flex-shrink-0 w-16 h-16 bg-surface-inset rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.homeTeam?.club?.name || "",
                )}.webp`}
                alt={
                  match.homeTeam?.club?.name || tMatches("matchesTable.club")
                }
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/clubs/defaultLogo.30cc7520.svg";
                }}
              />
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && match.homeTeamScore > match.awayTeamScore
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
            {hasScore ? (
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-2xl",
                    match.homeTeamScore > match.awayTeamScore
                      ? "font-bold text-text-heading"
                      : "font-normal text-text-body",
                  )}
                >
                  {match.homeTeamScore}
                </span>
                <span className="text-xl text-text-muted">-</span>
                <span
                  className={cn(
                    "text-2xl",
                    match.awayTeamScore > match.homeTeamScore
                      ? "font-bold text-text-heading"
                      : "font-normal text-text-body",
                  )}
                >
                  {match.awayTeamScore}
                </span>
              </div>
            ) : (
              <Badge variant="outline" size="md">
                {tMatches("upcoming")}
              </Badge>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="flex-shrink-0 w-16 h-16 bg-surface-inset rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.awayTeam?.club?.name || "",
                )}.webp`}
                alt={
                  match.awayTeam?.club?.name || tMatches("matchesTable.club")
                }
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/clubs/defaultLogo.30cc7520.svg";
                }}
              />
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && match.awayTeamScore > match.homeTeamScore
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
    </button>
  );
};

export default MatchesCard;
