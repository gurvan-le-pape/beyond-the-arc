// src/frontend/features/teams/components/detail/team-roster/SortControls.tsx
import { useTranslations } from "next-intl";

import type { SortConfig, SortKey } from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { key: "number", labelKey: "number" },
  { key: "ppg", labelKey: "stats.points.abbr" },
  { key: "rpg", labelKey: "stats.rebounds.abbr" },
  { key: "apg", labelKey: "stats.assists.abbr" },
  { key: "name", labelKey: "name" },
] as const satisfies readonly { key: SortKey; labelKey: string }[];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SortControlsProps {
  readonly sortConfig: SortConfig;
  readonly onSort: (key: SortKey) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * The row of sort buttons above the roster, showing which key is active and in
 * which direction.
 *
 * **`SORT_OPTIONS` here and the sort switch in `TeamRoster` must stay in step.**
 * A key added to this list renders a button immediately, but falls through to
 * the switch's default and returns 0 — the button highlights, the arrow flips,
 * and nothing reorders. Neither the compiler nor a test catches that; the two
 * lists are joined only by the `SortKey` union.
 *
 * Labels come from two namespaces on purpose: the stat abbreviations are shared
 * vocabulary in `common`, while "player" and the number heading are the team
 * page's own wording.
 */
export function SortControls({ sortConfig, onSort }: SortControlsProps) {
  const tCommon = useTranslations("common");
  const tTeams = useTranslations("teams");

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {SORT_OPTIONS.map(({ key, labelKey }) => {
        const isActive = sortConfig.key === key;
        let label: string;
        if (key === "name") {
          label = tTeams("teamDetail.player");
        } else if (key === "number") {
          label = tTeams("teamDetail.numberShort");
        } else {
          label = tCommon(labelKey);
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSort(key)}
            // A sort toggle, not a radio: pressing the active one again
            // reverses it, so the state is "pressed" plus its direction.
            aria-pressed={isActive}
            className={[
              "inline-flex items-center gap-1 px-3 py-1 rounded-button text-xs font-semibold border transition-colors duration-150 focus-ring",
              isActive
                ? "bg-tint-primary text-ink-primary border-line-primary"
                : "bg-transparent text-text-secondary border-divide hover:border-solid-primary hover:text-ink-primary",
            ].join(" ")}
          >
            {label}
            {isActive && (
              <span className="text-[10px]">
                <span aria-hidden="true">
                  {sortConfig.direction === "desc" ? "↓" : "↑"}
                </span>
                <span className="sr-only">
                  {tCommon(`sortDirection.${sortConfig.direction}`)}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
