// src/frontend/features/teams/components/list/TeamsCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Team } from "@/features/teams/types/Team";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import { LEVEL_CONFIG } from "@/shared/constants/levelConfig";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface TeamCardProps {
  team: Team;
  onClick: (id: number) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  const clubName = team.club?.name ?? null;
  const level = team.pool?.championship?.level?.toLowerCase() ?? "";
  const division = team.pool?.championship?.division ?? null;
  const poolLetter = team.pool?.letter ?? null;
  const category = team.category ?? null;
  const gender = team.gender ?? null;

  const config =
    LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.default;

  return (
    <button
      type="button"
      onClick={() => onClick(team.id)}
      className={cn(
        "w-full text-left border-l-8 rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface",
        "surface-raised",
        config.border,
      )}
      aria-label={tCommon("team.seeTeam", { number: team.number })}
    >
      {/* Header strip */}
      <div
        className={cn(
          "px-6 py-3 flex items-center justify-between flex-wrap gap-2",
          config.bg,
        )}
      >
        <Text variant="label">{clubName ?? NA}</Text>
        <div className="flex items-center gap-2">
          {category && (
            <Badge variant="outline" size="sm">
              {category}
            </Badge>
          )}
          {gender && (
            <Badge variant="outline" size="sm">
              {tCommon(`gender.${gender.toLowerCase()}`)}
            </Badge>
          )}
          {division && (
            <Badge variant="outline" size="sm">
              {`Div ${division}`}
            </Badge>
          )}
          {poolLetter && (
            <Badge variant="outline" size="sm">
              {`${tTeams("pool")} ${poolLetter}`}
            </Badge>
          )}
          {level && (
            <Badge variant={config.badgeVariant} size="sm">
              {tCommon(`competition.levels.${level}Short`)}
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 flex items-center gap-6">
        {/* Club logo */}
        <div className="flex-shrink-0 w-14 h-14 bg-surface-inset rounded-button flex items-center justify-center overflow-hidden">
          <img
            src={
              clubName
                ? `/images/clubs/${formatNameToFileName(clubName)}.webp`
                : "/images/clubs/defaultLogo.30cc7520.svg"
            }
            alt={clubName ?? ""}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/clubs/defaultLogo.30cc7520.svg";
            }}
          />
        </div>

        {/* Team info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-text-heading truncate">
            {clubName ?? NA}
          </p>
          {!!team.number && (
            <Text variant="caption" as="span">
              {tTeams("teamNumber", { number: team.number })}
            </Text>
          )}
        </div>

        {/* Committee / League */}
        {team.club?.committee && (
          <div className="hidden md:flex flex-col items-end min-w-0 flex-1">
            {team.club.committee.league && (
              <Text variant="caption" as="p" className="truncate text-right">
                {team.club.committee.league.name}
              </Text>
            )}
            <Text variant="caption" as="p" className="truncate text-right">
              {team.club.committee.name}
            </Text>
          </div>
        )}

        {/* Team number circle */}
        {!!team.number && (
          <div
            className={cn(
              "flex-shrink-0 hidden sm:flex items-center justify-center w-12 h-12 rounded-full",
              config.bg,
            )}
          >
            <span className="text-lg font-bold text-text-emphasis">
              {team.number}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default TeamCard;
