// src/frontend/shared/components/domain/LeaderboardTable.tsx
import { useTranslations } from "next-intl";

import type { Leaderboard } from "@/features/competitions/leaderboards/types";

import { Section } from "../blocks";
import { DataTable, type TableColumn } from "../table";
import { ClubCrest } from "./ClubCrest";

interface LeaderboardTableProps {
  readonly leaderboards: Leaderboard[];
  readonly dropdown?: React.ReactNode;
}

export function LeaderboardTable({
  leaderboards,
  dropdown,
}: LeaderboardTableProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const columns: TableColumn<Leaderboard>[] = [
    {
      key: "rank",
      header: tCommon("table.rank"),
      align: "center",
      render: (row) => row.rank,
      emphasis: true,
    },
    {
      key: "team",
      header: tCommon("table.team"),
      align: "left",
      render: (row) => (
        <div className="flex items-center gap-2">
          <ClubCrest clubName={row.clubName} />
          <span>
            {row.clubName} - {row.teamNumber}
          </span>
        </div>
      ),
    },
    {
      key: "points",
      header: tCommon("stats.points.full"),
      align: "center",
      render: (row) => row.points,
    },
    {
      key: "gamesPlayed",
      header: tCommon("stats.gamesPlayed"),
      align: "center",
      render: (row) => row.gamesPlayed,
    },
    {
      key: "gamesWon",
      header: tCommon("table.gamesWon"),
      align: "center",
      render: (row) => row.gamesWon,
    },
    {
      key: "gamesLost",
      header: tCommon("table.gamesLost"),
      align: "center",
      render: (row) => row.gamesLost,
    },
    {
      key: "pointDifference",
      header: tCommon("table.pointDifference"),
      align: "center",
      render: (row) => row.pointDifference,
    },
  ];

  return (
    <Section variant="highlighted" title={tCompetitions("leaderboardTitle")}>
      <div className="flex justify-end mb-2">
        <div className="min-w-[200px]">{dropdown}</div>
      </div>
      <DataTable
        columns={columns}
        rows={leaderboards}
        getRowKey={(row) => row.id}
        emptyMessage={tCompetitions("leaderboardEmpty")}
        striped
      />
    </Section>
  );
}

export default LeaderboardTable;
