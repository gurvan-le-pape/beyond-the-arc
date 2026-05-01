// src/frontend/features/competitions/championships/components/list/ChampionshipCard.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types/Championship";
import { Link } from "@/navigation";
import { CompetitionLevel } from "@/shared/constants";

const levelColorMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]:
    "bg-regional-light/20 text-regional-dark border-regional-DEFAULT dark:bg-regional-dark/20 dark:text-regional-light dark:border-regional-light",
  [CompetitionLevel.DEPARTMENTAL]:
    "bg-departmental-light/20 text-departmental-dark border-departmental-DEFAULT dark:bg-departmental-dark/20 dark:text-departmental-light dark:border-departmental-light",
  [CompetitionLevel.NATIONAL]:
    "bg-national-light/20 text-national-dark border-national-DEFAULT dark:bg-national-dark/20 dark:text-national-light dark:border-national-light",
};

const levelBorderMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]:
    "border-l-regional-DEFAULT dark:border-l-regional-light",
  [CompetitionLevel.DEPARTMENTAL]:
    "border-l-departmental-DEFAULT dark:border-l-departmental-light",
  [CompetitionLevel.NATIONAL]:
    "border-l-national-DEFAULT dark:border-l-national-light",
};

export function ChampionshipCard({
  championship,
}: {
  readonly championship: Championship;
}) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const levelColor =
    levelColorMap[championship.level] ??
    levelColorMap[CompetitionLevel.DEPARTMENTAL];
  const borderColor =
    levelBorderMap[championship.level] ??
    levelBorderMap[CompetitionLevel.DEPARTMENTAL];

  return (
    <Link
      href={`/championships/${championship.id}`}
      className={`group flex flex-col gap-3 p-4 rounded-card border border-divide-light dark:border-divide-dark border-l-4 ${borderColor} bg-surface-base dark:bg-surface-subtle-dark hover:shadow-card-hover dark:hover:shadow-card-dark hover:scale-[1.01] transition-all duration-200 shadow-card`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColor}`}
        >
          {tCommon(`competition.levels.${championship.level}`)}
        </span>
        <span className="text-xs text-text-muted dark:text-text-muted-dark">
          {championship.seasonYear}
        </span>
      </div>
      <div className="font-semibold text-text-heading dark:text-text-heading-dark group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 leading-snug">
        {championship.name}
      </div>
      <div className="flex flex-wrap gap-2">
        {championship.category && (
          <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark">
            {championship.category}
          </span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark capitalize">
          {championship.gender}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-raised dark:bg-surface-raised-dark text-text-secondary dark:text-text-secondary-dark">
          {tCompetitions("divisionWithValue", { value: championship.division })}
        </span>
      </div>
    </Link>
  );
}
