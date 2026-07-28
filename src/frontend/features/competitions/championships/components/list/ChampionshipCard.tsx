// src/frontend/features/competitions/championships/components/list/ChampionshipCard.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { Link } from "@/navigation";
import { Badge } from "@/shared/components/primitives";
import { CompetitionLevel, LEVEL_CONFIG } from "@/shared/constants";
import { cn, formatCommitteeName, formatLeagueName } from "@/shared/utils";

export function ChampionshipCard({
  championship,
}: {
  readonly championship: Championship;
}) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const level = championship.level;
  const config = (level && LEVEL_CONFIG[level]) || LEVEL_CONFIG.default;

  return (
    <Link
      href={`/championships/${championship.id}`}
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
          <Badge
            variant={championship.gender}
            size="sm"
          >
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

      {/* Body */}
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
            <p className="font-semibold text-text-heading leading-snug group-hover:text-primary transition-colors duration-200">
              {championship.name}
            </p>
          )}
      </div>
    </Link>
  );
}
