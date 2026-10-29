// src/frontend/shared/components/domain/EntityCardBadges.tsx
"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";
import type { CompetitionLevel, Gender } from "@/shared/constants";

import { getLevelConfig } from "./ListEntityCard";

interface EntityCardBadgesProps {
  readonly category?: string | null;
  readonly gender?: Gender | null;
  readonly division?: number | null;
  /** Pre-formatted pool label (e.g. "Pool A" or a pool name). */
  readonly poolLabel?: string | null;
  readonly level: CompetitionLevel | undefined;
}

/**
 * The category / gender / division / pool / level badge cluster shared by the
 * teams, players, and matches list cards. Omitted entries render nothing.
 */
export function EntityCardBadges({
  category,
  gender,
  division,
  poolLabel,
  level,
}: EntityCardBadgesProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const config = getLevelConfig(level);

  return (
    <>
      {category && (
        <Badge variant="category" size="sm">
          {category}
        </Badge>
      )}
      {gender && (
        <Badge variant={gender} size="sm">
          {tCommon(`gender.${gender}`)}
        </Badge>
      )}
      {division && (
        <Badge variant="division" size="sm">
          {tCompetitions("divisionWithValue", { value: division })}
        </Badge>
      )}
      {poolLabel && (
        <Badge variant="pool" size="sm">
          {poolLabel}
        </Badge>
      )}
      {level && (
        <Badge variant={config.badgeVariant} size="sm">
          {tCommon(`competition.levels.${level}Short`)}
        </Badge>
      )}
    </>
  );
}
