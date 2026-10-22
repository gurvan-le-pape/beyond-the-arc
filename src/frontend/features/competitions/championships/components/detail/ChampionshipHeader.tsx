// src/frontend/features/competitions/championships/components/detail/ChampionshipHeader.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Championship } from "@/features/competitions/championships/types";
import { buildChampionshipHeading } from "@/features/competitions/championships/utils";
import { Card, Divide, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";

interface ChampionshipHeaderProps {
  readonly championship: Championship;
  /** Under a rule beneath the heading: the links to sibling championships. */
  readonly children?: ReactNode;
}

/**
 * The identity block on a championship detail page: the category, gender and
 * division as the page's heading, and under it the organiser, linked to its
 * page, and the season.
 *
 * The organiser is the committee at departmental level and the league
 * otherwise, named after its department or region. It is left out when neither
 * is set — national championships have no organisation above them.
 */
export function ChampionshipHeader({
  championship,
  children,
}: ChampionshipHeaderProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const tOrganizations = useTranslations("organizations");

  const heading = buildChampionshipHeading(championship, {
    gender: tCommon(`gender.${championship.gender}`),
    division: tCompetitions("divisionWithValue", {
      value: championship.division,
    }),
  });

  const isDepartmental = championship.level === CompetitionLevel.DEPARTMENTAL;
  const organizer = isDepartmental
    ? {
        kind: tOrganizations("header.committeeKind"),
        place: championship.departmentName,
        id: championship.committeeId,
        path: "/organizations/committees",
      }
    : {
        kind: tOrganizations("header.leagueKind"),
        place: championship.regionName,
        id: championship.leagueId,
        path: "/organizations/leagues",
      };

  return (
    <Card padding="none">
      <div className="p-4 sm:p-6">
        <Text variant="h1" className="text-xl md:text-2xl">
          {heading}
        </Text>
        <Text variant="body" className="mt-1 text-text-secondary">
          {organizer.place && organizer.id !== null && (
            <>
              {organizer.kind}
              {" · "}
              <TextLink
                href={`${organizer.path}/${organizer.id}`}
                variant="plain"
              >
                {organizer.place}
              </TextLink>
              {" · "}
            </>
          )}
          {championship.seasonYear}
        </Text>
      </div>
      {children && (
        <>
          <Divide />
          <div className="px-4 py-3 sm:px-6">{children}</div>
        </>
      )}
    </Card>
  );
}

export default ChampionshipHeader;
