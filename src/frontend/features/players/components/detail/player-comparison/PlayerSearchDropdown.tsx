// src/frontend/features/players/components/detail/player-comparison/PlayerSearchDropdown.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ErrorMessage } from "@/shared/components/feedback";
import { DebouncedInput } from "@/shared/components/forms";
import { Button, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { Category, Gender } from "@/shared/constants";
import { cn, formatNameToFileName } from "@/shared/utils";

import { usePlayerSearch } from "../../../api";
import type { Player } from "../../../types/Player";
import { PlayerIdentity } from "./PlayerIdentity";

// ─── Dropdown content ─────────────────────────────────────────────────────────

interface DropdownContentProps {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly results: Player[];
  readonly onSelect: (player: Player) => void;
  readonly onRetry: () => unknown;
}

function DropdownContent({
  isLoading,
  isError,
  results,
  onSelect,
  onRetry,
}: DropdownContentProps) {
  const tPlayers = useTranslations("players");
  const tCommon = useTranslations("common");

  if (isLoading) {
    return (
      <Text variant="caption" className="px-3 py-2.5">
        {tCommon("loading")}
      </Text>
    );
  }

  // Before the empty check: a failed search returns no results either, and
  // saying "no players found" would report a broken request as an answer.
  if (isError) {
    return (
      <ErrorMessage
        message={tCommon("errors.fetchPlayers")}
        onRetry={onRetry}
        className="px-3 py-2.5"
      />
    );
  }

  if (results.length === 0) {
    return (
      <Text variant="caption" className="px-3 py-2.5">
        {tPlayers("playerDetail.compareNoResults")}
      </Text>
    );
  }

  return results.map((player, i) => {
    const clubName = player.team?.club?.name ?? "";

    return (
      <button
        key={player.id}
        type="button"
        onClick={() => onSelect(player)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 text-left",
          "hover:bg-surface-inset transition-colors",
          i !== 0 && "border-t border-divide",
        )}
      >
        <ImageWithFallback
          src={`/images/clubs/${formatNameToFileName(clubName)}.webp`}
          alt={clubName}
          fallback="/images/clubs/defaultLogo.30cc7520.svg"
          className="w-6 h-6 object-contain shrink-0"
        />
        <div className="min-w-0 flex flex-col">
          <Text variant="label" as="span" className="text-text-heading">
            #{player.number} {player.name}
          </Text>
          <Text variant="caption" as="span">
            {clubName}
          </Text>
        </div>
      </button>
    );
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PlayerSearchDropdownProps {
  readonly excludeId: number;
  readonly gender: Gender;
  readonly category: Category;
  readonly selectedPlayer: Player | null;
  readonly onSelect: (player: Player) => void;
  readonly onClear: () => void;
}

export function PlayerSearchDropdown({
  excludeId,
  gender,
  category,
  selectedPlayer,
  onSelect,
  onClear,
}: PlayerSearchDropdownProps) {
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");

  // `query` is already debounced: DebouncedInput only calls onChange once the
  // typing settles, so this state never holds a per-keystroke value.
  const [query, setQuery] = useState("");

  const {
    data: results = [],
    isLoading,
    isError,
    refetch,
  } = usePlayerSearch(query, {
    excludeId,
    gender,
    category,
  });

  const showDropdown = query.trim().length >= 2;

  // ─── Selected state ───────────────────────────────────────────────────
  if (selectedPlayer) {
    return (
      <div className="relative flex flex-col items-end text-right">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onClear}
          aria-label={tCommon("clear")}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full border border-divide bg-surface-inset"
        >
          <X className="w-3 h-3" aria-hidden="true" />
        </Button>

        <PlayerIdentity player={selectedPlayer} side="right" />
      </div>
    );
  }

  // ─── Empty / searching state ──────────────────────────────────────────
  return (
    <div className="relative w-full">
      <DebouncedInput
        variant="search"
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
        placeholder={tPlayers("playerDetail.compareSearch")}
        clearAriaLabel={tCommon("clearSearch")}
      />

      {showDropdown && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1 z-20",
            "max-h-64 overflow-y-auto scrollbar-hide",
            "rounded-lg border border-divide",
            "surface-subtle shadow-card-hover",
          )}
        >
          <DropdownContent
            isLoading={isLoading}
            isError={isError}
            results={results}
            onSelect={(player) => {
              onSelect(player);
              setQuery("");
            }}
            onRetry={refetch}
          />
        </div>
      )}
    </div>
  );
}
