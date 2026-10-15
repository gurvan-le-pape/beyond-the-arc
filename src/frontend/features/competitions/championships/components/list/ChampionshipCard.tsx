// src/frontend/features/competitions/championships/components/list/ChampionshipCard.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { Badge, Card } from "@/shared/components/primitives";
import { CompetitionLevel, LEVEL_CONFIG } from "@/shared/constants";
import { cn, formatCommitteeName, formatLeagueName } from "@/shared/utils";

interface ChampionshipCardProps {
  readonly championship: Championship;
}

/**
 * A championship as a card in the level listings.
 *
 * Like the list row, the title is derived rather than stored: level, category,
 * gender and division together are what identify a championship. The level
 * also drives the card's accent, so a championship with none renders neutral.
 */
export function ChampionshipCard({ championship }: ChampionshipCardProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const level = championship.level;
  const config = (level && LEVEL_CONFIG[level]) || LEVEL_CONFIG.default;

  return (
    <Card
      padding="none"
      href={`/championships/${championship.id}`}
      className={cn(
        "group relative overflow-hidden",
        config.border,
        config.hover,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          "px-5 py-3 border-b border-white/5",
          config.bg,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-text-heading" />
          {level && (
            <Badge variant={config.badgeVariant} size="sm">
              {tCommon(`competition.levels.${level}`)}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {championship.category && (
            <Badge variant="category" size="sm">
              {championship.category}
            </Badge>
          )}
          <Badge variant={championship.gender} size="sm">
            {tCommon(`gender.${championship.gender}`)}
          </Badge>
          <Badge variant="division" size="sm">
            {tCompetitions("divisionWithValue", {
              value: championship.division,
            })}
          </Badge>
          {championship.pools.length > 0 && (
            <Badge variant="pool" size="sm">
              {tCompetitions("poolCount", { count: championship.pools.length })}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-5 py-3 flex flex-col gap-1">
        {championship.committeeName && (
          <span className="text-sm text-text-secondary">
            {formatCommitteeName(championship.committeeName)}
          </span>
        )}
        {championship.leagueName && (
          <span
            className={cn(
              "text-sm",
              // Demoted a step when a committee line sits above it, so the two
              // read as a hierarchy. Both steps have to be readable, so the
              // pair moves down the scale rather than reaching for `muted`.
              championship.committeeName
                ? "text-text-secondary"
                : "text-text-body",
            )}
          >
            {formatLeagueName(championship.leagueName)}
          </span>
        )}
        {championship.level === CompetitionLevel.NATIONAL &&
          championship.name && (
            <p className="font-semibold text-text-heading leading-snug group-hover:text-ink-primary transition-colors duration-200">
              {championship.name}
            </p>
          )}
      </div>
    </Card>
  );
}
