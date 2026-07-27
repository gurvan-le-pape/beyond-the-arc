// src/frontend/shared/components/domain/LeaderboardTable.tsx
import { useTranslations } from "next-intl";

import type { Leaderboard } from "@/features/competitions/leaderboards/types";

import { Section } from "../blocks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
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

  return (
    <Section variant="highlighted" title={tCompetitions("leaderboardTitle")}>
      <div className="flex justify-end mb-2">
        <div className="min-w-[200px]">{dropdown}</div>
      </div>
      <Table className="border border-primary rounded-card box-border">
        <TableHeader className="bg-primary-subtle border-b border-primary">
          <TableRow>
            <TableHead className="text-center text-text-heading">
              {tCommon("table.rank")}
            </TableHead>
            <TableHead className="text-left text-text-heading">
              {tCommon("table.team")}
            </TableHead>
            <TableHead className="text-center text-text-heading">
              {tCommon("stats.points.full")}
            </TableHead>
            <TableHead className="text-center text-text-heading">
              {tCommon("stats.gamesPlayed")}
            </TableHead>
            <TableHead className="text-center text-text-heading">
              {tCommon("table.gamesWon")}
            </TableHead>
            <TableHead className="text-center text-text-heading">
              {tCommon("table.gamesLost")}
            </TableHead>
            <TableHead className="text-center text-text-heading">
              {tCommon("table.pointDifference")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboards.map((leaderboard, index) => (
            <TableRow
              key={leaderboard.id}
              className={
                index % 2 === 0 ? "bg-primary-ghost" : "bg-surface-inset"
              }
            >
              {/* Rank Column */}
              <TableCell highlight className="text-center text-text-heading">
                {leaderboard.rank}
              </TableCell>

              {/* Team Column with Logo */}
              <TableCell className="text-left text-text-heading">
                <div className="flex items-center gap-2">
                  <ClubCrest clubName={leaderboard.clubName} />
                  <span>
                    {leaderboard.clubName} - {leaderboard.teamNumber}
                  </span>
                </div>
              </TableCell>

              {/* Points Column */}
              <TableCell className="text-center text-text-heading">
                {leaderboard.points}
              </TableCell>

              {/* Games Played Column */}
              <TableCell className="text-center text-text-heading">
                {leaderboard.gamesPlayed}
              </TableCell>

              {/* Games Won Column */}
              <TableCell className="text-center text-text-heading">
                {leaderboard.gamesWon}
              </TableCell>

              {/* Games Lost Column */}
              <TableCell className="text-center text-text-heading">
                {leaderboard.gamesLost}
              </TableCell>

              {/* Goal Difference Column */}
              <TableCell className="text-center text-text-heading">
                {leaderboard.pointDifference}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

export default LeaderboardTable;
