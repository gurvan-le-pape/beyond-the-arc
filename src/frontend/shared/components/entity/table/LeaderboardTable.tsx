// src/frontend/shared/components/entity/table/LeaderboardTable.tsx
import { useTranslations } from "next-intl";

import {
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

interface LeaderboardTableProps {
  readonly leaderboards: any[];
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
      <Table className="border border-primary-500 dark:border-primary-600 rounded-card box-border">
        <TableHeader className="bg-primary-100 dark:bg-primary-900/30 border-b border-primary-500 dark:border-primary-600">
          <TableRow>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("table.rank")}
            </TableHead>
            <TableHead className="text-left text-gray-900 dark:text-gray-100">
              {tCommon("table.team")}
            </TableHead>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("stats.points")}
            </TableHead>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("stats.gamesPlayed")}
            </TableHead>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("table.gamesWon")}
            </TableHead>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("table.gamesLost")}
            </TableHead>
            <TableHead className="text-center text-gray-900 dark:text-gray-100">
              {tCommon("table.pointDifference")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboards.map((leaderboard, index) => (
            <TableRow
              key={leaderboard.id}
              className={
                index % 2 === 0
                  ? "bg-primary-50 dark:bg-gray-700/30"
                  : "bg-white dark:bg-gray-800"
              }
            >
              {/* Rank Column */}
              <TableCell
                highlight
                className="text-center text-gray-900 dark:text-gray-100"
              >
                {index + 1}
              </TableCell>

              {/* Team Column with Logo */}
              <TableCell className="text-left text-gray-900 dark:text-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    src={`/images/clubs/${leaderboard.clubName}.webp`}
                    alt={`${leaderboard.clubName} logo`}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).src = `/images/clubs/defaultLogo.30cc7520.svg`;
                    }}
                  />
                  <span>
                    {leaderboard.clubName} - {leaderboard.teamNumber}
                  </span>
                </div>
              </TableCell>

              {/* Points Column */}
              <TableCell className="text-center text-gray-900 dark:text-gray-100">
                {leaderboard.points}
              </TableCell>

              {/* Games Played Column */}
              <TableCell className="text-center text-gray-900 dark:text-gray-100">
                {leaderboard.gamesPlayed}
              </TableCell>

              {/* Games Won Column */}
              <TableCell className="text-center text-gray-900 dark:text-gray-100">
                {leaderboard.gamesWon}
              </TableCell>

              {/* Games Lost Column */}
              <TableCell className="text-center text-gray-900 dark:text-gray-100">
                {leaderboard.gamesLost}
              </TableCell>

              {/* Goal Difference Column */}
              <TableCell className="text-center text-gray-900 dark:text-gray-100">
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
