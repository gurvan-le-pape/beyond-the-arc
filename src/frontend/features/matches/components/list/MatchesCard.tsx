// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Badge } from "@/shared/components/primitives";
import { CompetitionLevel } from "@/shared/constants";
import { formatMatchDate, formatMatchTime } from "@/shared/utils";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

/**
 * Match level badge variant mapping
 */
const MATCH_LEVEL_CONFIG = {
  departmental: {
    border: "border-l-departmental-DEFAULT dark:border-l-departmental-light",
    bg: "bg-departmental-light/20 dark:bg-departmental-dark/20",
    badgeVariant: "departmental" as const,
  },
  regional: {
    border: "border-l-regional-DEFAULT dark:border-l-regional-light",
    bg: "bg-regional-light/20 dark:bg-regional-dark/20",
    badgeVariant: "regional" as const,
  },
  national: {
    border: "border-l-national-DEFAULT dark:border-l-national-light",
    bg: "bg-national-light/20 dark:bg-national-dark/20",
    badgeVariant: "national" as const,
  },
  default: {
    border: "border-l-divide-light dark:border-l-divide-dark",
    bg: "bg-surface-subtle dark:bg-surface-subtle-dark/50",
    badgeVariant: "default" as const,
  },
} as const;

interface MatchesCardProps {
  match: any;
  onClick: (matchId: number) => void;
}

/**
 * Match card component
 * Displays a single match with teams, scores, and competition info
 */
export const MatchesCard: React.FC<MatchesCardProps> = ({ match, onClick }) => {
  const t = useTranslations("matches");

  /**
   * Get level-specific styling for a match
   */
  const getMatchConfig = () => {
    const level = match.pool?.championship?.level?.toLowerCase() || "";

    if (level === CompetitionLevel.DEPARTMENTAL) {
      return {
        ...MATCH_LEVEL_CONFIG.departmental,
        label: t("levels.departmental"),
      };
    }
    if (level === CompetitionLevel.REGIONAL) {
      return { ...MATCH_LEVEL_CONFIG.regional, label: t("levels.regional") };
    }
    if (level === CompetitionLevel.NATIONAL) {
      return { ...MATCH_LEVEL_CONFIG.national, label: t("levels.national") };
    }

    return { ...MATCH_LEVEL_CONFIG.default, label: t("levels.default") };
  };

  const config = getMatchConfig();

  const hasScore = match.homeTeamScore !== null && match.awayTeamScore !== null;

  return (
    <button
      type="button"
      onClick={() => onClick(match.id)}
      className={cn(
        "w-full text-left border-l-8 rounded-card shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 cursor-pointer overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-surface-raised dark:focus:ring-offset-surface-raised-dark",
        "bg-surface-raised dark:bg-surface-raised-dark",
        config.border,
      )}
      aria-label={t("ariaLabelMatch", {
        home: match.homeTeam?.club?.name || "",
        away: match.awayTeam?.club?.name || "",
      })}
    >
      {/* Header: Competition Info & Date */}
      <div className={cn("px-6 py-3", config.bg)}>
        <div className="flex justify-between items-center flex-wrap gap-2">
          {/* Competition Details */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-text-emphasis dark:text-text-emphasis-dark">
              {match.pool?.championship?.category} -{" "}
              {match.pool?.championship?.gender}
              {match.pool?.championship?.division &&
                ` • Div ${match.pool?.championship?.division}`}
            </p>
            {match.pool?.name && (
              <Badge variant="outline" size="sm">
                {match.pool.name}
              </Badge>
            )}
          </div>

          {/* Date, Time, Matchday, Level Badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-body dark:text-text-body-dark">
              {formatMatchDate(match.date)} • {formatMatchTime(match.date)}
            </span>
            <Badge variant="default" size="sm">
              {t("matchdayLabel", { matchday: match.matchday })}
            </Badge>
            <Badge variant={config.badgeVariant} size="sm">
              {config.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Match Content */}
      <div className="px-8 py-8 bg-surface-raised dark:bg-surface-raised-dark">
        <div className="flex items-center justify-between gap-6">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            {/* Team Logo */}
            <div className="flex-shrink-0 w-16 h-16 bg-surface-subtle dark:bg-surface-subtle-dark rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.homeTeam?.club?.name || "",
                )}.webp`}
                alt={match.homeTeam?.club?.name || t("matchesTable.club")}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/clubs/defaultLogo.30cc7520.svg";
                }}
              />
            </div>

            {/* Team Name */}
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && match.homeTeamScore > match.awayTeamScore
                    ? "font-bold text-text-heading dark:text-text-heading-dark"
                    : "font-normal text-text-emphasis dark:text-text-emphasis-dark",
                )}
              >
                {match.homeTeam?.club?.name}
                {match.homeTeam?.number && ` - ${match.homeTeam.number}`}
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
                      ? "font-bold text-text-heading dark:text-text-heading-dark"
                      : "font-normal text-text-body dark:text-text-body-dark",
                  )}
                >
                  {match.homeTeamScore}
                </span>
                <span className="text-xl text-text-muted dark:text-text-muted-dark">
                  -
                </span>
                <span
                  className={cn(
                    "text-2xl",
                    match.awayTeamScore > match.homeTeamScore
                      ? "font-bold text-text-heading dark:text-text-heading-dark"
                      : "font-normal text-text-body dark:text-text-body-dark",
                  )}
                >
                  {match.awayTeamScore}
                </span>
              </div>
            ) : (
              <Badge variant="outline" size="md">
                {t("upcoming")}
              </Badge>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            {/* Team Logo */}
            <div className="flex-shrink-0 w-16 h-16 bg-surface-subtle dark:bg-surface-subtle-dark rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.awayTeam?.club?.name || "",
                )}.webp`}
                alt={match.awayTeam?.club?.name || t("matchesTable.club")}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/clubs/defaultLogo.30cc7520.svg";
                }}
              />
            </div>

            {/* Team Name */}
            <div className="text-center">
              <p
                className={cn(
                  "text-lg",
                  hasScore && match.awayTeamScore > match.homeTeamScore
                    ? "font-bold text-text-heading dark:text-text-heading-dark"
                    : "font-normal text-text-emphasis dark:text-text-emphasis-dark",
                )}
              >
                {match.awayTeam?.club?.name}
                {match.awayTeam?.number && ` - ${match.awayTeam.number}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default MatchesCard;
