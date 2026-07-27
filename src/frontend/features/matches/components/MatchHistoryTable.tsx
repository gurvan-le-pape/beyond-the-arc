// src/frontend/features/matches/components/MatchHistoryTable.tsx
"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { Button } from "@/shared/components/primitives";
import { DataTable, type TableColumn } from "@/shared/components/table";

/**
 * Props for MatchHistoryTable.
 * Show/hide state is managed internally — consumers only need to provide labels.
 */
interface MatchHistoryTableProps<T> {
  readonly matches: T[];
  readonly columns: TableColumn<T>[];
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
      <DataTable<T>
        columns={columns}
        rows={displayedMatches}
        getRowKey={(match) => match.id}
        variant="highlighted"
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
        striped
      />

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
