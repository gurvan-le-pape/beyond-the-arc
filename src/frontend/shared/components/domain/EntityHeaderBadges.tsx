// src/frontend/shared/components/domain/EntityHeaderBadges.tsx
"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Badge } from "@/shared/components/primitives";
import type { CompetitionLevel, Gender } from "@/shared/constants";

interface EntityHeaderBadgesProps {
  readonly category: string;
  readonly gender: Gender;
  readonly championship?: {
    readonly level?: CompetitionLevel;
    readonly division?: number;
  } | null;
  /** Extra badges appended after the shared cluster, e.g. a player position. */
  readonly children?: ReactNode;
}

/**
 * The category / gender / level / division badge row shared by the team and
 * player detail headers, which differ only in what they append afterwards.
 *
 * The list-card equivalent is `EntityCardBadges` — kept separate because the
 * cards also carry a pool badge and take their level from a different shape.
 */
export function EntityHeaderBadges({
  category,
  gender,
  championship,
  children,
}: EntityHeaderBadgesProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <Badge variant="category" size="sm">
        {category}
      </Badge>

      <Badge variant={gender} size="sm">
        {tCommon(`gender.${gender}`)}
      </Badge>

      {championship?.level && (
        <Badge variant={championship.level} size="sm">
          {tCommon(`competition.levels.${championship.level}Short`)}
        </Badge>
      )}

      {/* Guarded on `division`, not on `championship`: division is optional,
          and the literal this replaced rendered "Div undefined" without it. */}
      {championship?.division !== undefined && (
        <Badge variant="division" size="sm">
          {tCompetitions("divisionWithValue", {
            value: championship.division,
          })}
        </Badge>
      )}

      {children}
    </div>
  );
}
