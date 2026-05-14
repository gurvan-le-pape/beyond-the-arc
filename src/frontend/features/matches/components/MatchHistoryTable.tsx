// src/frontend/features/matches/components/MatchHistoryTable.tsx
"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { Button } from "@/shared/components/primitives";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";

/**
 * Column configuration for the match history table.
 * Describes how to render a single column — header label, cell content, and alignment.
 * The className prop has been intentionally removed; spacing is handled by the Table primitives.
 */
export interface MatchHistoryColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (match: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

/**
 * Props for MatchHistoryTable.
 * Show/hide state is managed internally — consumers only need to provide labels.
 */
interface MatchHistoryTableProps<T> {
  readonly matches: T[];
  readonly columns: MatchHistoryColumn<T>[];
  readonly emptyMessage: string;
  readonly onRowClick?: (match: T) => void;
  readonly showAllLabel: string;
  readonly showLessLabel: string;
  readonly maxRows?: number;
  readonly title?: string;
}

/**
 * Generic match history table with built-in expand/collapse.
 *
 * Accepts any match shape via the T generic — column rendering is fully
 * delegated to the caller via the columns prop, typically built with a
 * domain-specific hook (e.g. usePlayerMatchHistoryColumns, useTeamMatchHistoryColumns).
 *
 * @example
 * <MatchHistoryTable<TeamMatchHistory>
 *   matches={matches}
 *   columns={columns}
 *   emptyMessage="No matches found"
 *   onRowClick={(match) => router.push(`/matches/${match.id}`)}
 *   showAllLabel="See all 12 matches"
 *   showLessLabel="See less"
 *   maxRows={5}
 *   title="Match history"
 * />
 */
export function MatchHistoryTable<T extends { id: number }>({
  matches,
  columns,
  emptyMessage,
  onRowClick,
  showAllLabel,
  showLessLabel,
  maxRows = 5,
  title,
}: MatchHistoryTableProps<T>) {
  const [showAll, setShowAll] = useState(false);

  const displayedMatches = showAll ? matches : matches.slice(0, maxRows);
  const hasMoreMatches = matches.length > maxRows;

  return (
    <Section title={title} variant="highlighted">
      <Table className="border border-primary rounded-card box-border">
        <TableHeader className="bg-primary-subtle border-b border-primary">
          <TableRow hoverable={false}>
            {columns.map((col) => (
              <TableHead key={col.key} align={col.align}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {matches.length === 0 ? (
            <TableEmpty colSpan={columns.length} message={emptyMessage} />
          ) : (
            displayedMatches.map((match, index) => (
              <TableRow
                key={match.id}
                clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(match) : undefined}
                className={
                  index % 2 === 0 ? "bg-primary-ghost" : "bg-surface-inset"
                }
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align}>
                    {col.render(match)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {hasMoreMatches && (
        <div className="flex justify-center py-4 border-t border-divide">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? showLessLabel : showAllLabel}
            {showAll ? (
              <ChevronUp className="ml-2 w-4 h-4" />
            ) : (
              <ChevronDown className="ml-2 w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </Section>
  );
}

export default MatchHistoryTable;
