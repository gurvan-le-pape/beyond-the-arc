// src/frontend/features/matches/components/detail/events/filters/FilterablePlayerList.tsx
import React from "react";

import type { TeamInfoExtended } from "@/features/teams/types/TeamInfo";
import { Text } from "@/shared/components/typography";
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
      <Text variant="h4" className="text-sm mb-2 truncate">
        {team.name}
      </Text>

      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
        {team.players.map((player) => (
          <label
            key={player.player.id}
            className={cn(
              "flex items-center gap-2 text-sm p-1 rounded transition-colors duration-200 cursor-pointer",
              "hover:bg-surface-raised dark:hover:bg-surface-raised-dark",
            )}
          >
            <input
              type="checkbox"
              checked={selectedIds.has(player.player.id)}
              onChange={() => onToggle(player.player.id)}
              className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <Text variant="label" as="span">
              #{player.player.number} {player.player.name}
            </Text>
          </label>
        ))}
      </div>
    </div>
  );
}

export default FilterablePlayerList;
