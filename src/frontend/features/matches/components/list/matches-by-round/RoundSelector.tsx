// src/frontend/features/matches/components/list/matches-by-round/RoundSelector.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconButton } from "@/shared/components/primitives";

interface RoundSelectorProps {
  readonly rounds: number[];
  readonly selectedRound: number | null;
  readonly onSelect: (round: number) => void;
}

/**
 * The matchday picker above a championship's fixtures: previous and next
 * arrows around the selected round and how many there are.
 *
 * The arrows step the selection one round at a time; there is no jump, since
 * the page opens on the latest played round and readers move from there.
 *
 * `rounds` arrives already sorted numerically. A `selectedRound` of `null`
 * means none is chosen yet, not round zero, and both arrows stay disabled.
 */
export function RoundSelector({
  rounds,
  selectedRound,
  onSelect,
}: RoundSelectorProps) {
  const t = useTranslations("competitions.roundSelector");

  if (rounds.length === 0) return null;

  const index = selectedRound === null ? -1 : rounds.indexOf(selectedRound);
  const previous = index > 0 ? rounds[index - 1] : undefined;
  const next =
    index !== -1 && index < rounds.length - 1 ? rounds[index + 1] : undefined;

  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="outline"
        onPress={() => previous !== undefined && onSelect(previous)}
        isDisabled={previous === undefined}
        label={t("previous")}
      >
        <ChevronLeft />
      </IconButton>

      {/* Announced on each step, since the arrows' own names stay the same. */}
      <p
        aria-live="polite"
        className="min-w-32 text-center text-sm font-semibold text-text-heading tabular-nums"
      >
        {selectedRound !== null && t("current", { round: selectedRound })}{" "}
        <span className="font-normal text-text-body">/ {rounds.length}</span>
      </p>

      <IconButton
        variant="outline"
        onPress={() => next !== undefined && onSelect(next)}
        isDisabled={next === undefined}
        label={t("next")}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
}
