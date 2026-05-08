// src/frontend/features/competitions/championships/components/list/ChampionshipCard.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types/Championship";
import { Link } from "@/navigation";
import { CompetitionLevel } from "@/shared/constants";

const levelColorMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]:
    "bg-regional-subtle text-regional-strong border-regional",
  [CompetitionLevel.DEPARTMENTAL]:
    "bg-departmental-subtle text-departmental-strong border-departmental",
  [CompetitionLevel.NATIONAL]:
    "bg-national-subtle text-national-strong border-national",
};

const levelBorderMap: Record<string, string> = {
  [CompetitionLevel.REGIONAL]: "border-l-regional",
  [CompetitionLevel.DEPARTMENTAL]: "border-l-departmental",
  [CompetitionLevel.NATIONAL]: "border-l-national",
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
      className={`group flex flex-col gap-3 p-4 rounded-card border border-divide border-l-4 ${borderColor} surface-subtle hover:shadow-card-hover hover:scale-[1.01] transition-all duration-200 shadow-card`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColor}`}
        >
          {tCommon(`competition.levels.${championship.level}`)}
        </span>
        <span className="text-xs text-text-muted">
          {championship.seasonYear}
        </span>
      </div>
      <div className="font-semibold text-text-heading group-hover:text-primary transition-colors duration-200 leading-snug">
        {championship.name}
      </div>
      <div className="flex flex-wrap gap-2">
        {championship.category && (
          <span className="text-xs px-2 py-0.5 rounded-button bg-surface-inset text-text-secondary">
            {championship.category}
          </span>
        )}
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-inset text-text-secondary capitalize">
          {championship.gender}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-button bg-surface-inset text-text-secondary">
          {tCompetitions("divisionWithValue", { value: championship.division })}
        </span>
      </div>
    </Link>
  );
}
