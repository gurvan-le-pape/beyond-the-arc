// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Link } from "@/navigation";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { LEVEL_CONFIG } from "@/shared/constants";
import {
  cn,
  formatMatchDate,
  formatMatchTime,
  formatNameToFileName,
} from "@/shared/utils";

import type { Match } from "../../types";

export const MatchesCard: React.FC<{ match: Match }> = ({ match }) => {
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");

  const level = match.pool?.championship?.level?.toLowerCase() ?? "";
  const config =
    LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.default;
  const { homeTeamScore, awayTeamScore } = match;
  const hasScore = homeTeamScore !== null && awayTeamScore !== null;

  return (
    <Link
      href={`/matches/${match.id}`}
      aria-label={tMatches("ariaLabelMatch", {
        home: match.homeTeam?.club?.name || "",
        away: match.awayTeam?.club?.name || "",
      })}
      className={cn(
        "group relative overflow-hidden rounded-card border",
        "surface-raised shadow-card",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "hover:shadow-card-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-surface",
        config.border,
        config.hover,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 flex-wrap",
          "px-5 py-3",
          "border-b border-white/5",
          config.bg,
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-text-heading" />
          <div className="flex items-center gap-2">
            <Text variant="label" className={cn("font-semibold", config.text)}>
              {formatMatchDate(match.date)} • {formatMatchTime(match.date)}
            </Text>
            <Badge variant="default" size="sm">
              {tMatches("matchdayLabel", { matchday: match.matchday })}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {match.pool?.championship?.category && (
            <Badge variant="category" size="sm">
              {match.pool.championship.category}
            </Badge>
          )}
          {match.pool?.championship?.gender && (
            <Badge
              variant={
                match.pool.championship.gender.toLowerCase() as
                  | "male"
                  | "female"
              }
              size="sm"
            >
              {tCommon(
                `gender.${match.pool.championship.gender.toLowerCase()}`,
              )}
            </Badge>
          )}
          {match.pool?.championship?.division && (
            <Badge variant="division" size="sm">
              {`Div ${match.pool.championship.division}`}
            </Badge>
          )}
          {match.pool?.name && (
            <Badge variant="pool" size="sm">
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

      {/* Match Content */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-14 h-14 rounded-card flex-shrink-0",
                "flex items-center justify-center overflow-hidden",
                "bg-gradient-to-br from-surface-inset to-surface-own",
                "border border-divide/60 shadow-sm",
              )}
            >
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.homeTeam?.club?.name || "",
                )}.webp`}
                alt={
                  match.homeTeam?.club?.name || tMatches("matchesTable.club")
                }
                className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
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
            {hasScore ? (
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-2xl",
                    homeTeamScore > awayTeamScore
                      ? "font-bold text-text-heading"
                      : "font-normal text-text-body",
                  )}
                >
                  {homeTeamScore}
                </span>
                <span className="text-xl text-text-muted">-</span>
                <span
                  className={cn(
                    "text-2xl",
                    awayTeamScore > homeTeamScore
                      ? "font-bold text-text-heading"
                      : "font-normal text-text-body",
                  )}
                >
                  {awayTeamScore}
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
            <div
              className={cn(
                "w-14 h-14 rounded-card flex-shrink-0",
                "flex items-center justify-center overflow-hidden",
                "bg-gradient-to-br from-surface-inset to-surface-own",
                "border border-divide/60 shadow-sm",
              )}
            >
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.awayTeam?.club?.name || "",
                )}.webp`}
                alt={
                  match.awayTeam?.club?.name || tMatches("matchesTable.club")
                }
                className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
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
    </Link>
  );
};

export default MatchesCard;
