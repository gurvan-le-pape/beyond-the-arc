// src/frontend/features/organizations/committees/components/detail/CommitteeHeader.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { Committee } from "@/features/organizations/committees/types";
import { OrganizationHeader } from "@/features/organizations/components";
import {
  namesMatch,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import { formatCommitteeName } from "@/shared/utils";

interface CommitteeHeaderProps {
  readonly committee: Committee;
  /** The departmental championships the committee runs, fetched by the page. */
  readonly championshipCount: number;
}

/**
 * Identity block at the top of a committee page. A committee is named after
 * its department, so the heading is the place name; the subtitle gives the
 * department code and, when it says something the place name does not, the
 * federation's official name.
 */
export function CommitteeHeader({
  committee,
  championshipCount,
}: CommitteeHeaderProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();

  const placeName = committee.department.name;
  const officialName = formatCommitteeName(committee.name);

  return (
    <OrganizationHeader
      name={placeName}
      logoName={committee.name}
      imageFolder="committees"
      subtitle={[
        t("header.committeeKind"),
        normalizeDepartmentCode(committee.department.code),
        namesMatch(officialName, placeName) ? null : officialName,
      ]
        .filter(Boolean)
        .join(" · ")}
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

export default CommitteeHeader;
