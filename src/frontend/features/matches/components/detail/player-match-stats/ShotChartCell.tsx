// src/frontend/features/matches/components/detail/player-match-stats/ShotChartCell.tsx
"use client";

import { BarChart2 } from "lucide-react";

import type { NamedEntity } from "@/shared/types";

interface ShotChartCellProps {
  readonly player: NamedEntity;
  readonly onSelect: (player: NamedEntity) => void;
  readonly label: string;
}

/** Shot-chart table cell that opens the shot modal for a player on click. */
export function ShotChartCell({ player, onSelect, label }: ShotChartCellProps) {
  return (
    <button
      type="button"
      className="p-1 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity duration-200 focus-ring rounded"
      title={label}
      onClick={() => onSelect(player)}
      aria-label={label}
    >
      <BarChart2 className="h-5 w-5 text-primary" aria-hidden />
    </button>
  );
}

export default ShotChartCell;
