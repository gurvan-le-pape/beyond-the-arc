// src/frontend/features/matches/components/list/MatchesCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import { Badge } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants";
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
    label: "Dép.",
  },
  regional: {
    border: "border-l-regional-DEFAULT dark:border-l-regional-light",
    bg: "bg-regional-light/20 dark:bg-regional-dark/20",
    badgeVariant: "regional" as const,
    label: "Rég.",
  },
  national: {
    border: "border-l-national-DEFAULT dark:border-l-national-light",
    bg: "bg-national-light/20 dark:bg-national-dark/20",
    badgeVariant: "national" as const,
    label: "Nat.",
  },
  default: {
    border: "border-l-gray-400 dark:border-l-gray-500",
    bg: "bg-gray-50 dark:bg-gray-800/50",
    badgeVariant: "default" as const,
    label: "N/A",
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
      return MATCH_LEVEL_CONFIG.departmental;
    }
    if (level === CompetitionLevel.REGIONAL) {
      return MATCH_LEVEL_CONFIG.regional;
    }
    if (level === CompetitionLevel.NATIONAL) {
      return MATCH_LEVEL_CONFIG.national;
    }

    return MATCH_LEVEL_CONFIG.default;
  };

  /**
   * Format match date for display
   */
  const formatMatchDate = (date: string) => {
    const matchDate = new Date(date);
    return {
      date: matchDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      time: matchDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const config = getMatchConfig();

  const { date, time } = formatMatchDate(match.date);
  const hasScore = match.homeTeamScore !== null && match.awayTeamScore !== null;

  return (
    <button
      type="button"
      onClick={() => onClick(match.id)}
      className={cn(
        "w-full text-left border-l-8 rounded-card shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 cursor-pointer overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
        "bg-white dark:bg-gray-800",
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
            <p className="text-body-sm font-semibold text-gray-800 dark:text-gray-200">
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
            <span className="text-body-sm text-gray-600 dark:text-gray-400">
              {date} • {time}
            </span>
            <Badge variant="default" size="sm">
              J{match.matchday}
            </Badge>
            <Badge variant={config.badgeVariant} size="sm">
              {config.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Match Content */}
      <div className="px-8 py-8 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between gap-6">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            {/* Team Logo */}
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.homeTeam?.club?.name || "",
                )}.webp`}
                alt={match.homeTeam?.club?.name || "Club"}
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
                  "text-body-lg",
                  hasScore && match.homeTeamScore > match.awayTeamScore
                    ? "font-bold text-gray-900 dark:text-gray-100"
                    : "font-normal text-gray-700 dark:text-gray-300",
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
                    "text-title",
                    match.homeTeamScore > match.awayTeamScore
                      ? "font-bold text-gray-900 dark:text-gray-100"
                      : "font-normal text-gray-600 dark:text-gray-400",
                  )}
                >
                  {match.homeTeamScore}
                </span>
                <span className="text-subtitle text-gray-400 dark:text-gray-500">
                  -
                </span>
                <span
                  className={cn(
                    "text-title",
                    match.awayTeamScore > match.homeTeamScore
                      ? "font-bold text-gray-900 dark:text-gray-100"
                      : "font-normal text-gray-600 dark:text-gray-400",
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
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-button flex items-center justify-center overflow-hidden">
              <img
                src={`/images/clubs/${formatNameToFileName(
                  match.awayTeam?.club?.name || "",
                )}.webp`}
                alt={match.awayTeam?.club?.name || "Club"}
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
                  "text-body-lg",
                  hasScore && match.awayTeamScore > match.homeTeamScore
                    ? "font-bold text-gray-900 dark:text-gray-100"
                    : "font-normal text-gray-700 dark:text-gray-300",
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
