// src/frontend/features/matches/components/detail/MatchBreadcrumb.tsx
import { useTranslations } from "next-intl";

import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
import type { MatchPoolRef } from "@/features/matches/types";
import { Breadcrumb } from "@/shared/components/navigation";

interface MatchBreadcrumbProps {
  /** The match's pool, with the championship it belongs to. */
  readonly pool: MatchPoolRef;
  readonly matchName: string;
}

/**
 * The trail above a match page: the championships list, then the championship
 * opened on the match's pool, then the match itself. The championship is
 * named in full, place and season included, since a match page is reached
 * from outside its championship too.
 */
export function MatchBreadcrumb({ pool, matchName }: MatchBreadcrumbProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const { championship } = pool;

  return (
    <Breadcrumb
      items={[
        { label: tCompetitions("breadcrumb"), href: "/championships" },
        {
          label: buildChampionshipTitle(championship, {
            gender: tCommon(`gender.${championship.gender}`),
            division: tCompetitions("divisionWithValue", {
              value: championship.division,
            }),
          }),
          href: `/championships/${championship.id}?pool=${pool.id}`,
        },
        { label: matchName, current: true },
      ]}
    />
  );
}
