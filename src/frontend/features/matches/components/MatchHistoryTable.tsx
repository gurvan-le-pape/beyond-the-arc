// src/frontend/features/matches/components/MatchHistoryTable.tsx
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React from "react";

import { Button, Card } from "@/shared/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

/**
 * Column configuration for the match history table (generic)
 */
export interface MatchHistoryColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (match: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * Props for MatchHistoryTable component (generic)
 */
interface MatchHistoryTableProps<T> {
  matches: T[];
  columns: MatchHistoryColumn<T>[];
  emptyMessage: string;
  onRowClick?: (match: T) => void;
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  showAllLabel: string;
  showLessLabel: string;
  maxRows?: number;
  title?: string;
}

/**
 * Match History Table Component (generic)
 *
 * Displays match history with expandable rows and consistent styling.
 * Now using the reusable Table component for consistency.
 *
 * Features:
 * - Dark mode support
 * - Responsive design
 * - Show more/less functionality
 * - Clickable rows
 * - Empty state handling
 *
 * @example
 * <MatchHistoryTable<Match>
 *   matches={matches}
 *   columns={matchColumns}
 *   emptyMessage="No matches found"
 *   onRowClick={(match) => router.push(`/matches/${match.id}`)}
 *   showAll={showAll}
 *   setShowAll={setShowAll}
 *   showAllLabel="Show all matches"
 *   showLessLabel="Show less"
 *   maxRows={5}
 *   title="Recent Matches"
 * />
 */
export function MatchHistoryTable<T extends { id: number }>({
  matches,
  columns,
  emptyMessage,
  onRowClick,
  showAll,
  setShowAll,
  showAllLabel,
  showLessLabel,
  maxRows = 5,
  title,
}: MatchHistoryTableProps<T>) {
  // Determine which matches to display based on showAll state
  const displayedMatches = showAll ? matches : matches.slice(0, maxRows);

  // Check if we should show the expand/collapse button
  const hasMoreMatches = matches.length > maxRows;

  return (
    <Card variant="highlighted" padding="none">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-subtitle font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  align={col.align}
                  className={col.className}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {matches.length === 0 ? (
              <TableEmpty colSpan={columns.length} message={emptyMessage} />
            ) : (
              displayedMatches.map((match) => (
                <TableRow
                  key={match.id}
                  clickable={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(match) : undefined}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align}
                      className={col.className}
                    >
                      {col.render(match)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Show More/Less Footer */}
      {hasMoreMatches && (
        <div className="flex justify-center py-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? showLessLabel : showAllLabel}
            {showAll ? (
              <ChevronUpIcon className="ml-2 w-4 h-4" />
            ) : (
              <ChevronDownIcon className="ml-2 w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default MatchHistoryTable;
