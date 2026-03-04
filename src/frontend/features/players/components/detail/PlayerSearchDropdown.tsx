// src/frontend/features/players/components/detail/PlayerSearchDropdown.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

import { SearchInput } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

import { usePlayerSearch } from "../../hooks";
import type { Player } from "../../types/Player";

interface PlayerSearchDropdownProps {
  /** Id of the player already on the page – excluded from results. */
  excludeId: number;
  /** Callback fired when the user taps a result. */
  onSelect: (player: Player) => void;
}

/**
 * A search box that resolves to a list of players.
 * Typing is debounced; selecting an item clears the query and calls onSelect.
 * Clicking outside the dropdown closes it without selecting.
 */
export function PlayerSearchDropdown({
  excludeId,
  onSelect,
}: PlayerSearchDropdownProps) {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");
  const { query, setQuery, results, isLoading } = usePlayerSearch({
    excludeId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const showDropdown = query.trim().length >= 2;

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!showDropdown) return;

    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown, setQuery]);

  const handleSelect = (player: Player) => {
    onSelect(player);
    setQuery(""); // close + reset
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery("")}
        placeholder={tPlayers("playerDetail.compareSearch")}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1 z-20 max-h-64 overflow-y-auto",
            "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            "rounded-lg shadow-lg dark:shadow-2xl",
          )}
        >
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {tCommon("loading")}
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {tPlayers("playerDetail.compareNoResults")}
            </p>
          ) : (
            results.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => handleSelect(player)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                  "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                )}
              >
                {/* Tiny club logo */}
                <img
                  src={`/images/clubs/${formatNameToFileName(
                    player.team?.club?.name || "",
                  )}.webp`}
                  alt={player.team?.club?.name || ""}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/clubs/defaultLogo.30cc7520.svg";
                  }}
                />

                {/* Name + meta */}
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    #{player.number} {player.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {player.team?.club?.name || ""}
                    {player.team?.category ? ` · ${player.team.category}` : ""}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
