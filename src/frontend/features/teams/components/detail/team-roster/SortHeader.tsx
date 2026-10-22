// src/frontend/features/teams/components/detail/team-roster/SortHeader.tsx
import type { SortConfig, SortKey } from "./types";

interface SortHeaderProps {
  readonly sortKey: SortKey;
  readonly label: string;
  /** The label written out, when `label` is an abbreviation. */
  readonly fullLabel?: string;
  readonly sortConfig: SortConfig;
  readonly onSort: (key: SortKey) => void;
}

/**
 * A roster column heading that sorts by its column when pressed, with an arrow
 * on the active column.
 *
 * The arrow is for sighted readers only: the table sets `aria-sort` on the
 * column from the same `sortConfig`, which is what assistive technology
 * announces. An abbreviated label is named by its full form.
 */
export function SortHeader({
  sortKey,
  label,
  fullLabel,
  sortConfig,
  onSort,
}: SortHeaderProps) {
  const isActive = sortConfig.key === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      title={fullLabel}
      aria-label={fullLabel}
      className="inline-flex items-center gap-1 uppercase hover:text-ink-primary focus-ring rounded-sm"
    >
      {label}
      {isActive && (
        <span aria-hidden="true">
          {sortConfig.direction === "desc" ? "↓" : "↑"}
        </span>
      )}
    </button>
  );
}
