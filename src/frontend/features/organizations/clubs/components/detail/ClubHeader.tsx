// src/frontend/features/organizations/clubs/components/detail/ClubHeader.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { ClubDetailed } from "@/features/organizations/clubs/types";
import { OrganizationHeader } from "@/features/organizations/components";

interface ClubHeaderProps {
  readonly club: ClubDetailed;
}

/**
 * Identity block at the top of a club page: the club's mark and name, its
 * town, and three figures across all its teams — how many there are, how many
 * championships they enter, and their combined win–loss record.
 */
export function ClubHeader({ club }: ClubHeaderProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();

  const championshipCount = new Set(
    club.teams.map((team) => team.pool.championship.id),
  ).size;
  const won = club.teams.reduce(
    (sum, team) => sum + team.leaderboard.gamesWon,
    0,
  );
  const lost = club.teams.reduce(
    (sum, team) => sum + team.leaderboard.gamesLost,
    0,
  );

  return (
    <OrganizationHeader
      name={club.name}
      imageFolder="clubs"
      // The bullet is punctuation, not content — joining it into the string
      // would have a screen reader read "Saint-Etienne, bullet, 42000".
      subtitle={
        <>
          {club.city}
          {club.city && club.zipCode && <span aria-hidden="true"> • </span>}
          {club.zipCode}
        </>
      }
      stats={[
        {
          value: format.number(club.teams.length),
          label: t("header.teams", { count: club.teams.length }),
        },
        {
          value: format.number(championshipCount),
          label: t("header.championships", { count: championshipCount }),
        },
        {
          value: `${format.number(won)}–${format.number(lost)}`,
          label: t("header.record"),
        },
      ]}
    />
  );
}
