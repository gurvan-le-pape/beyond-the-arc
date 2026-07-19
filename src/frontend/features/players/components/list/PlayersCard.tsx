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
      : (clubName ?? teamNumber ?? NA);

  return (
    <Link
      href={`/players/${player.id}`}
      aria-label={tCommon("player.seePlayer", { name: player.name })}
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
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full flex-shrink-0",
              "bg-text-heading",
            )}
          />

          <Text
            variant="label"
            className={cn("truncate font-semibold", config.text)}
          >
            {clubTeamLabel}
          </Text>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {category && (
            <Badge variant="category" size="sm">
              {category}
            </Badge>
          )}
          {gender && (
            <Badge
              variant={gender.toLowerCase() as "male" | "female"}
              size="sm"
            >
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
      <div className="px-5 py-4 flex flex-col sm:flex-row gap-4">
        {/* Main content */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Logo */}
          <div
            className={cn(
              "w-14 h-14 rounded-card flex-shrink-0",
              "flex items-center justify-center overflow-hidden",
              "bg-gradient-to-br from-surface-inset to-surface-own",
              "border border-divide/60 shadow-sm",
            )}
          >
            <img
              src={
                clubName
                  ? `/images/clubs/${formatNameToFileName(clubName)}.webp`
                  : "/images/clubs/defaultLogo.30cc7520.svg"
              }
              alt={clubName ?? ""}
              className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/clubs/defaultLogo.30cc7520.svg";
              }}
            />
          </div>

          {/* Player identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-lg font-bold text-text-heading truncate">
                {player.name}
              </p>

              {!!player.number && (
                <span className="text-sm font-semibold text-text-muted">
                  #{player.number}
                </span>
              )}
            </div>

            {committee && (
              <div className="mt-1 flex flex-col">
                {committee.league && (
                  <Text variant="caption" as="p" className="truncate">
                    {committee.league.name}
                  </Text>
                )}

                <Text
                  variant="caption"
                  as="p"
                  className="truncate text-text-muted"
                >
                  {committee.name}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Player number block */}
        {!!player.number && (
          <div
            className={cn(
              "hidden sm:flex flex-shrink-0",
              "items-center justify-center",
              "w-12 h-12 rounded-card border",
              "font-black text-lg tracking-tight",
              config.bg,
              config.border,
              "text-text-heading",
            )}
          >
            {player.number}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlayerCard;
