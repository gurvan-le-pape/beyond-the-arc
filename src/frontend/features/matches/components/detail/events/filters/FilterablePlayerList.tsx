// src/frontend/features/matches/components/detail/events/filters/FilterablePlayerList.tsx
import React from "react";

import type { TeamInfoExtended } from "@/features/teams/types/TeamInfo";
import { cn } from "@/shared/utils/cn";

interface FilterablePlayerListProps {
  team: TeamInfoExtended;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}

/**
 * Renders a single team's player list as a scrollable column of checkboxes.
 * Used twice inside PlayerFilter – once for the home team, once for away.
 */
export function FilterablePlayerList({
  team,
  selectedIds,
  onToggle,
}: FilterablePlayerListProps) {
  return (
    <div className="min-w-0">
      <h4 className="font-bold text-body-sm text-gray-700 dark:text-gray-300 mb-2 truncate">
        {team.name}
      </h4>

      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
        {team.players.map((player) => (
          <label
            key={player.player.id}
            className={cn(
              "flex items-center gap-2 text-body-sm p-1 rounded transition-colors duration-200 cursor-pointer",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
            )}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(player.player.id)}
              onChange={() => onToggle(player.player.id)}
              className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <span className="text-gray-700 dark:text-gray-300">
              #{player.player.number} {player.player.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterablePlayerList;
