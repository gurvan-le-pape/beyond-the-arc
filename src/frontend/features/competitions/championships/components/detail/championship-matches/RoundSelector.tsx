// src/frontend/features/competitions/championships/components/detail/championship-matches/RoundSelector.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Select } from "@/shared/components/forms";
import { PillButton } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

interface RoundSelectorProps {
  rounds: number[];
  selectedRound: number | null;
  onSelect: (round: number) => void;
  className?: string;
}

// Dynamic visible count logic for desktop. Module-level because these are
// constants, not derived state — keeping them in the component body made the
// resize effect's empty dependency array look like a suppression.
const ROUND_SELECTOR_PILL_MIN_WIDTH = 48;
const PILL_MIN_WIDTH = ROUND_SELECTOR_PILL_MIN_WIDTH + 8; // px (minWidth + px-4 padding)
const PILL_SPACING = 8; // px (space-x-2)
const MAX_VISIBLE = 8;

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [startIdx, setStartIdx] = useState(0);
  const endIdx = Math.min(startIdx + visibleCount, rounds.length);

  // Recalculate visibleCount on resize
  useEffect(() => {
    function updateVisibleCount() {
      const container = containerRef.current;
      if (!container) return;
      const width = container.offsetWidth;
      // 2 arrows + (n pills * pillMinWidth + (n-1)*pillSpacing)
      const available = width - 80; // 2*36px arrows + 8px buffer
      const count = Math.max(
        1,
        Math.min(
          MAX_VISIBLE,
          Math.floor(
            (available + PILL_SPACING) / (PILL_MIN_WIDTH + PILL_SPACING),
          ),
        ),
      );
      setVisibleCount(count);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Ensure selected round is always visible when it changes. Uses the
  // functional setter so the current startIdx is never read from the closure —
  // returning `prev` unchanged when the round is already visible lets React
  // bail out instead of re-running this on every startIdx change.
  useEffect(() => {
    if (selectedRound === null) return;
    const idx = rounds.indexOf(selectedRound);
    if (idx === -1) return;
    setStartIdx((prev) => {
      if (idx < prev) return idx;
      if (idx >= prev + visibleCount)
        return Math.max(0, idx - visibleCount + 1);
      return prev;
    });
  }, [selectedRound, rounds, visibleCount]);

  const canScrollLeft = startIdx > 0;
  const canScrollRight = endIdx < rounds.length;

  const handleLeft = () => setStartIdx((prev) => Math.max(0, prev - 1));
  const handleRight = () =>
    setStartIdx((prev) => Math.min(rounds.length - visibleCount, prev + 1));

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
          onClick={handleLeft}
          disabled={!canScrollLeft}
          aria-label={t("roundSelector.scrollLeft")}
        >
          <ChevronLeft className="w-5 h-5" />
        </PillButton>

        <div className="flex space-x-2">
          {rounds.slice(startIdx, endIdx).map((round) => {
            const isActive = selectedRound === round;
            return (
              <PillButton
                key={round}
                variant={isActive ? "pillActive" : "pillInactive"}
                size="pill"
                onClick={() => onSelect(round)}
                style={{ minWidth: ROUND_SELECTOR_PILL_MIN_WIDTH }}
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
          onClick={handleRight}
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
