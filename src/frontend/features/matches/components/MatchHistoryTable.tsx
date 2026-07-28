// src/frontend/features/matches/components/MatchHistoryTable.tsx
"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { Button } from "@/shared/components/primitives";
import { DataTable, type TableColumn } from "@/shared/components/table";

/**
 * Props for MatchHistoryTable.
 * Show/hide state is managed internally — consumers only need to provide labels.
 */
/**
 * The shape every match-history row shares. The teams are needed for the row
 * link's accessible name — the lead cell is a date, which does not identify
 * a match.
 */
interface MatchHistoryRow {
  readonly id: number;
  readonly homeTeam: { readonly club: { readonly name: string } };
  readonly awayTeam: { readonly club: { readonly name: string } };
}

interface MatchHistoryTableProps<T> {
  readonly matches: T[];
  readonly columns: TableColumn<T>[];
  readonly emptyMessage: string;
  readonly showAllLabel: string;
  readonly showLessLabel: string;
  readonly maxRows?: number;
  readonly title?: string;
  /**
   * Passed through to `DataTable`. Exposed because column count varies by
   * consumer — the team history is three columns, the player history nine —
   * and padding that suits one crowds the other.
   */
  readonly density?: "comfortable" | "cozy" | "compact";
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
 *   showAllLabel="See all 12 matches"
 *   showLessLabel="See less"
 *   maxRows={5}
 *   title="Match history"
 * />
 */
export function MatchHistoryTable<T extends MatchHistoryRow>({
  matches,
  columns,
  emptyMessage,
  showAllLabel,
  showLessLabel,
  maxRows = 5,
  title,
  density = "comfortable",
}: MatchHistoryTableProps<T>) {
  const tCommon = useTranslations("common");
  const [showAll, setShowAll] = useState(false);

  const displayedMatches = showAll ? matches : matches.slice(0, maxRows);
  const hasMoreMatches = matches.length > maxRows;

  return (
    <Section title={title} variant="highlighted">
      <DataTable<T>
        columns={columns}
        rows={displayedMatches}
        getRowKey={(match) => match.id}
        density={density}
        emptyMessage={emptyMessage}
        getRowHref={(match) => `/matches/${match.id}`}
        getRowLabel={(match) =>
          tCommon("matchHistory.viewMatch", {
            home: match.homeTeam.club.name,
            away: match.awayTeam.club.name,
          })
        }
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
