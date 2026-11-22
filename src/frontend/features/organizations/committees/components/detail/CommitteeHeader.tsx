// src/frontend/features/organizations/committees/components/detail/CommitteeHeader.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { Committee } from "@/features/organizations/committees/types";
import { OrganizationHeader } from "@/features/organizations/components";
import type { League } from "@/features/organizations/leagues/types";
import {
  distinctOfficialName,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import { TextLink } from "@/shared/components/primitives";
import { formatCommitteeName } from "@/shared/utils";

interface CommitteeHeaderProps {
  readonly committee: Committee;
  /** The league the committee belongs to, linked from the subtitle. */
  readonly league: League | undefined;
  /** The departmental championships the committee runs, fetched by the page. */
  readonly championshipCount: number;
}

/**
 * Identity block at the top of a committee page. A committee is named after
 * its department, so the heading is the place name; the subtitle gives the
 * department code and, when it says something the place name does not, the
 * federation's official name, then the league's region as a link up to it.
 */
export function CommitteeHeader({
  committee,
  league,
  championshipCount,
}: CommitteeHeaderProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();

  const placeName = committee.department.name;

  return (
    <OrganizationHeader
      name={placeName}
      logoName={committee.name}
      imageFolder="committees"
      subtitle={[
        t("header.committeeKind"),
        normalizeDepartmentCode(committee.department.code),
        distinctOfficialName(formatCommitteeName(committee.name), placeName),
        league && (
          <TextLink href={`/organizations/leagues/${league.id}`}>
            {league.region.name}
          </TextLink>
        ),
      ]}
      stats={[
        {
          value: format.number(committee.clubCount),
          label: t("header.clubs", { count: committee.clubCount }),
        },
        {
          value: format.number(championshipCount),
          label: t("header.championships", { count: championshipCount }),
        },
      ]}
    />
  );
}
