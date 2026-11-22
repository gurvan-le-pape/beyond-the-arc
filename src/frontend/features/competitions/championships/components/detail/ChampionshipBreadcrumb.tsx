// src/frontend/features/competitions/championships/components/detail/ChampionshipBreadcrumb.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { buildChampionshipHeading } from "@/features/competitions/championships/utils";
import { Breadcrumb } from "@/shared/components/navigation";

interface ChampionshipBreadcrumbProps {
  readonly championship: Championship;
}

/**
 * The trail above a championship detail page. It ends on the championship's
 * name, built with `buildChampionshipHeading` and the same labels the header
 * gives its heading, so the two read the same.
 */
export function ChampionshipBreadcrumb({
  championship,
}: ChampionshipBreadcrumbProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  return (
    <Breadcrumb
      items={[
        { label: tCompetitions("breadcrumb"), href: "/championships" },
        {
          label: buildChampionshipHeading(championship, {
            gender: tCommon(`gender.${championship.gender}`),
            division: tCompetitions("divisionWithValue", {
              value: championship.division,
            }),
          }),
          current: true,
        },
      ]}
    />
  );
}
