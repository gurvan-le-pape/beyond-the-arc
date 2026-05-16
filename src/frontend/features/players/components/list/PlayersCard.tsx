// src/frontend/features/players/components/list/PlayersCard.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { Player } from "@/features/players/types";
import { Link } from "@/navigation";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { LEVEL_CONFIG, NA } from "@/shared/constants";
import { cn, formatNameToFileName } from "@/shared/utils";

export const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
  const tCommon = useTranslations("common");

  const clubName = player.team?.club?.name ?? null;
  const teamNumber = player.team?.number ? String(player.team.number) : null;
  const category = player.team?.category ?? null;
  const gender = player.team?.gender ?? null;
  const level = player.team?.pool?.championship?.level?.toLowerCase() ?? "";
  const committee = player.team?.club?.committee ?? null;

  const config =
    LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.default;

  const clubTeamLabel =
    clubName && teamNumber
      ? `${clubName} - ${teamNumber}`
      : clubName ?? teamNumber ?? NA;

  return (
    <Link
      href={`/players/${player.id}`}
      className={cn(
        "w-full text-left border-l-8 rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface",
        "surface-raised",
        config.border,
      )}
      aria-label={tCommon("player.seePlayer", { name: player.name })}
    >
      {/* Header strip */}
      <div
        className={cn(
          "px-6 py-3 flex items-center justify-between flex-wrap gap-2",
          config.bg,
        )}
      >
        <Text variant="label">{clubTeamLabel}</Text>
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
          {level && (
            <Badge variant={config.badgeVariant} size="sm">
              {tCommon(`competition.levels.${level}Short`)}
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 flex items-center gap-6">
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

        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-text-heading truncate">
            {player.name}
          </p>
        </div>

        {committee && (
          <div className="hidden md:flex flex-col items-end min-w-0 flex-1">
            {committee.league && (
              <Text variant="caption" as="p" className="truncate text-right">
                {committee.league.name}
              </Text>
            )}
            <Text variant="caption" as="p" className="truncate text-right">
              {committee.name}
            </Text>
          </div>
        )}

        {!!player.number && (
          <div
            className={cn(
              "flex-shrink-0 hidden sm:flex items-center justify-center w-12 h-12 rounded-full",
              config.bg,
            )}
          >
            <span className="text-lg font-bold text-text-emphasis">
              #{player.number}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlayerCard;
