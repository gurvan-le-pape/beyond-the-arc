// src/frontend/features/competitions/championships/components/detail/championship-matches/RoundSelector.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";
import { PillButton } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

import { ROUND_PILL_MIN_WIDTH } from "./roundWindow";
import { useRoundWindow } from "./useRoundWindow";

interface RoundSelectorProps {
  readonly rounds: number[];
  readonly selectedRound: number | null;
  readonly onSelect: (round: number) => void;
  readonly className?: string;
}

/**
 * The matchday picker above a championship's fixtures.
 *
 * `rounds` arrives already sorted numerically — the keys come out of a grouped
 * object as strings, so the caller converts and sorts before passing them here.
 * A `selectedRound` of `null` means none is chosen yet, not round zero.
 *
 * Renders a dropdown below `md` and a scrollable pill carousel above it; the
 * arrows exist only in the carousel, where the list can overflow.
 */
export function RoundSelector({
  rounds,
  selectedRound,
  onSelect,
  className = "",
}: RoundSelectorProps) {
  const t = useTranslations("competitions");

  const {
    containerRef,
    visibleRounds,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  } = useRoundWindow(rounds, selectedRound);

  if (rounds.length === 0) return null;

  return (
    <div className={cn("mb-4", className)}>
      <div className="block md:hidden w-full">
        <Select
          value={selectedRound ?? ""}
          onChange={(val) => onSelect(Number(val))}
          className="w-full"
          options={rounds.map((round) => ({
            value: round,
            label: t("roundSelector.dropdownLabel", { round }),
          }))}
        />
      </div>

      <div
        className="hidden md:flex items-center justify-center space-x-2 px-0 py-2"
        ref={containerRef}
      >
        <PillButton
          variant="carouselArrow"
          size="icon"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label={t("roundSelector.scrollLeft")}
        >
          <ChevronLeft className="w-5 h-5" />
        </PillButton>

        <div className="flex space-x-2">
          {visibleRounds.map((round) => {
            const isActive = selectedRound === round;
            return (
              <PillButton
                key={round}
                variant={isActive ? "pillActive" : "pillInactive"}
                size="pill"
                onClick={() => onSelect(round)}
                style={{ minWidth: ROUND_PILL_MIN_WIDTH }}
                aria-pressed={isActive}
                aria-label={t("roundSelector.pillLabel", { round })}
              >
                {t("roundSelector.pillLabel", { round })}
              </PillButton>
            );
          })}
        </div>

        <PillButton
          variant="carouselArrow"
          size="icon"
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label={t("roundSelector.scrollRight")}
        >
          <ChevronRight className="w-5 h-5" />
        </PillButton>
      </div>
    </div>
  );
}

export default RoundSelector;
