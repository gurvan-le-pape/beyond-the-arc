// src/frontend/features/organizations/clubs/components/detail/ClubHeader.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { ClubDetailed } from "@/features/organizations/clubs/types";
import type { Committee } from "@/features/organizations/committees/types";
import { OrganizationHeader } from "@/features/organizations/components";
import { TextLink } from "@/shared/components/primitives";

interface ClubHeaderProps {
  readonly club: ClubDetailed;
  /** The committee the club belongs to, linked from the subtitle. */
  readonly committee: Committee | undefined;
}

/**
 * Identity block at the top of a club page: the club's mark and name, its
 * town and its committee, and three figures across all its teams — how many there are, how many
 * championships they enter, and their combined win–loss record.
 */
export function ClubHeader({ club, committee }: ClubHeaderProps) {
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
  const forfeited = club.teams.reduce(
    (sum, team) => sum + team.leaderboard.gamesForfeited,
    0,
  );

  return (
    <OrganizationHeader
      name={club.name}
      imageFolder="clubs"
      subtitle={[
        club.city,
        club.zipCode,
        committee && (
          // A department name breaks at its hyphens; it moves down whole.
          <span className="whitespace-nowrap">
            <TextLink href={`/organizations/committees/${committee.id}`}>
              {committee.department.name}
            </TextLink>
          </span>
        ),
      ]}
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
          value: `${format.number(won)}–${format.number(lost)}–${format.number(forfeited)}`,
          label: t("header.record"),
        },
      ]}
    />
  );
}
