// src/frontend/features/organizations/leagues/components/detail/LeagueHeader.tsx
import { useFormatter, useTranslations } from "next-intl";

import { OrganizationHeader } from "@/features/organizations/components";
import type { League } from "@/features/organizations/leagues/types";
import { distinctOfficialName } from "@/features/organizations/utils";
import { formatLeagueName } from "@/shared/utils";

interface LeagueHeaderProps {
  readonly league: League;
  /** The regional championships the league runs, fetched by the page. */
  readonly championshipCount: number;
}

/**
 * Identity block at the top of a league page. A league is named after its
 * region, so the heading is the place name; the subtitle gives the region
 * code and, when it says something the place name does not, the federation's
 * official name.
 */
export function LeagueHeader({ league, championshipCount }: LeagueHeaderProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();

  const placeName = league.region.name;

  return (
    <OrganizationHeader
      name={placeName}
      logoName={league.name}
      imageFolder="leagues"
      subtitle={[
        t("header.leagueKind"),
        league.region.code,
        distinctOfficialName(formatLeagueName(league.name), placeName),
      ]}
      stats={[
        {
          value: format.number(league.committeeCount),
          label: t("header.committees", { count: league.committeeCount }),
        },
        {
          value: format.number(league.clubCount),
          label: t("header.clubs", { count: league.clubCount }),
        },
        {
          value: format.number(championshipCount),
          label: t("header.championships", { count: championshipCount }),
        },
      ]}
    />
  );
}
