// src/frontend/features/players/components/detail/player-comparison/OpponentPicker.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ErrorMessage } from "@/shared/components/feedback";
import { ComboBox } from "@/shared/components/primitives";
import type { Category, Gender } from "@/shared/constants";
import { useDebounce } from "@/shared/hooks";

import { usePlayerSearch } from "../../../api";
import type { Player } from "../../../types/Player";

const playerName = (player: Player) => `#${player.number} ${player.name}`;

interface OpponentPickerProps {
  readonly excludeId: number;
  readonly gender: Gender;
  readonly category: Category;
  readonly selectedPlayer: Player | null;
  readonly onSelect: (player: Player) => void;
  readonly onClear: () => void;
}

/**
 * Autocomplete for picking the second player in a comparison.
 *
 * **The search is scoped, not global.** `gender` and `category` narrow it to
 * players who are actually comparable, and `excludeId` keeps the subject out of
 * their own comparison. All three are required for that reason — widening the
 * search means passing different values, never omitting them.
 *
 * A failed search shows its error under the field, so what was typed stays.
 */
export function OpponentPicker({
  excludeId,
  gender,
  category,
  selectedPlayer,
  onSelect,
  onClear,
}: OpponentPickerProps) {
  const tCommon = useTranslations("common");
  const tPlayers = useTranslations("players");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const {
    data: results = [],
    isLoading,
    isError,
    refetch,
  } = usePlayerSearch(debouncedSearch, {
    excludeId,
    gender,
    category,
    minLength: 1,
  });

  const selectedClub = selectedPlayer?.team.club.name;

  return (
    <div className="flex flex-col gap-2">
      <ComboBox
        labels={{
          clear: tCommon("clearSelection"),
          loading: tCommon("loading"),
          empty: tCommon("empty"),
          typeToSearch: tCommon("typeToSearch"),
        }}
        label={tPlayers("playerDetail.compareSearchLabel")}
        hideLabel
        browsable={false}
        placeholder={tPlayers("playerDetail.compareSearch")}
        options={results.map((player) => ({
          value: player.id,
          label: playerName(player),
          description: player.team.club.name,
        }))}
        value={selectedPlayer?.id}
        selectedLabel={
          selectedPlayer
            ? [playerName(selectedPlayer), selectedClub]
                .filter(Boolean)
                .join(" · ")
            : undefined
        }
        onChange={(id) => {
          if (id === undefined) return onClear();
          // Picked from the results on show, so it is among them.
          const picked = results.find((player) => player.id === id);
          if (picked) onSelect(picked);
        }}
        onSearchChange={setSearch}
        isLoading={isLoading}
        error={isError ? tCommon("errors.fetchPlayers") : undefined}
      />

      {isError && (
        <ErrorMessage
          message={tCommon("errors.fetchPlayers")}
          onRetry={refetch}
        />
      )}
    </div>
  );
}
