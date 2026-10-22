// src/frontend/features/organizations/clubs/components/ClubTeamsTable.tsx
import { useTranslations } from "next-intl";

import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import { Section } from "@/shared/components/blocks";
import { DataTable, type TableColumn } from "@/shared/components/table";
import { CATEGORY_LIST, Gender } from "@/shared/constants";
import { formatTeamName } from "@/shared/utils";

interface ClubTeamsTableProps {
  readonly clubName: string;
  readonly teams: ClubTeamInfo[];
  readonly title: string;
  readonly emptyMessage: string;
}

const CATEGORY_ORDER: readonly string[] = CATEGORY_LIST;
const GENDER_ORDER: readonly string[] = [Gender.FEMALE, Gender.MALE];

// Youngest category first, then women's before men's, then by number — the
// order the federation lists a club's teams in.
function compareTeams(a: ClubTeamInfo, b: ClubTeamInfo): number {
  return (
    CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
    GENDER_ORDER.indexOf(a.gender) - GENDER_ORDER.indexOf(b.gender) ||
    a.number - b.number
  );
}

/**
 * A club's teams, a row each: category, gender and number, the championship
 * and pool it plays in, its rank in that pool and its record. Each row links
 * to the team.
 *
 * The club is the page's subject, so its name is not repeated on every row;
 * the row link's accessible name carries it. On a phone the championship and
 * record step aside for the rank.
 */
export function ClubTeamsTable({
  clubName,
  teams,
  title,
  emptyMessage,
}: ClubTeamsTableProps) {
  const t = useTranslations("clubs");
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const tTeams = useTranslations("teams");

  const columns: TableColumn<ClubTeamInfo>[] = [
    {
      key: "category",
      header: t("detail.teamColumns.category"),
      align: "left",
      emphasis: true,
      render: (team) => tCommon(`category.${team.category}`),
    },
    {
      key: "gender",
      header: t("detail.teamColumns.gender"),
      align: "left",
      render: (team) => tCommon(`gender.${team.gender}`),
    },
    {
      key: "number",
      header: (
        <abbr
          title={t("detail.teamColumns.numberFull")}
          className="no-underline"
        >
          {t("detail.teamColumns.number")}
        </abbr>
      ),
      numeric: true,
      render: (team) => team.number,
    },
    {
      key: "championship",
      header: t("detail.teamColumns.championship"),
      align: "left",
      from: "sm",
      render: (team) => {
        const championship = team.pool?.championship;
        if (!team.pool || !championship) return "—";
        return [
          tCommon(`competition.levels.${championship.level}`),
          tCompetitions("divisionWithValue", { value: championship.division }),
          tTeams("poolLabel", { letter: team.pool.letter }),
        ].join(" · ");
      },
    },
    {
      key: "rank",
      header: t("detail.teamColumns.rank"),
      numeric: true,
      width: "fit",
      render: (team) =>
        team.leaderboard
          ? `${team.leaderboard.rank} / ${team.leaderboard.poolSize}`
          : "—",
    },
    {
      key: "record",
      header: t("detail.teamColumns.record"),
      numeric: true,
      width: "fit",
      from: "sm",
      render: (team) =>
        team.leaderboard
          ? `${team.leaderboard.gamesWon}–${team.leaderboard.gamesLost}`
          : "—",
    },
  ];

  return (
    <Section title={title}>
      <DataTable
        columns={columns}
        rows={[...teams].sort(compareTeams)}
        getRowKey={(team) => team.id}
        getRowHref={(team) => `/teams/${team.id}`}
        getRowLabel={(team) =>
          [
            formatTeamName(clubName, team.number),
            tCommon(`category.${team.category}`),
            tCommon(`gender.${team.gender}`),
          ].join(" · ")
        }
        density="cozy"
        emptyMessage={emptyMessage}
      />
    </Section>
  );
}
