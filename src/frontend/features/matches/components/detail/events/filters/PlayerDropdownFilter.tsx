// src/frontend/features/matches/components/detail/events/filters/PlayerDropdownFilter.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

import type { TeamInfoExtended } from "@/features/teams/types/TeamInfo";
import { cn } from "@/shared/utils/cn";

import { FilterablePlayerList } from "./FilterablePlayerList";

interface PlayerDropdownFilterProps {
  homeTeam: TeamInfoExtended;
  awayTeam: TeamInfoExtended;
  selectedPlayerIds: Set<number>;
  setSelectedPlayerIds: (ids: Set<number>) => void;
  togglePlayer: (id: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * Player multi-select filter.
 *
 * Renders a trigger button that shows how many players are currently selected,
 * and a popover containing a two-column grid of PlayerLists (home / away).
 * Clicking outside the popover or its trigger closes it.
 */
export function PlayerDropdownFilter({
  homeTeam,
  awayTeam,
  selectedPlayerIds,
  setSelectedPlayerIds,
  togglePlayer,
  isOpen,
  setIsOpen,
}: PlayerDropdownFilterProps) {
  const t = useTranslations("matches");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the user clicks outside the popover or its trigger.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-button transition-colors duration-200 flex items-center gap-2",
          "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400",
        )}
      >
        {t("matchEvents.players")}

        {/* Selection-count badge */}
        {selectedPlayerIds.size > 0 && (
          <span className="bg-primary-600 dark:bg-primary-500 text-white text-xs rounded-button px-2 py-0.5">
            {selectedPlayerIds.size}
          </span>
        )}

        {/* Animated chevron */}
        <span
          className={cn(
            "transform transition-transform duration-200 text-xs",
            isOpen && "rotate-180",
          )}
        >
          ▼
        </span>
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 mt-2 z-10 p-4 min-w-[500px]",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "rounded-card shadow-card-hover dark:shadow-card-dark",
          )}
        >
          {/* Two-column player grid */}
          <div className="grid grid-cols-2 gap-4">
            <FilterablePlayerList
              team={homeTeam}
              selectedIds={selectedPlayerIds}
              onToggle={togglePlayer}
            />
            <FilterablePlayerList
              team={awayTeam}
              selectedIds={selectedPlayerIds}
              onToggle={togglePlayer}
            />
          </div>

          {/* "Clear all" row – only visible when something is selected */}
          {selectedPlayerIds.size > 0 && (
            <button
              onClick={() => setSelectedPlayerIds(new Set())}
              className="mt-3 w-full px-3 py-1.5 text-sm rounded-button transition-colors duration-200 text-error-DEFAULT dark:text-error-light hover:bg-error-light/10 dark:hover:bg-error-dark/20 focus:outline-none focus:ring-2 focus:ring-error-DEFAULT dark:focus:ring-error-light"
            >
              {t("matchEvents.clearSelection")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerDropdownFilter;
