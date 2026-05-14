// src/frontend/features/competitions/championships/components/detail/navigation/RoundSelector.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { Select } from "@/shared/components/forms";
import { PillButton } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

interface RoundSelectorProps {
  rounds: number[];
  selectedRound: number | null;
  onSelect: (round: number) => void;
  className?: string;
}

export const RoundSelector: React.FC<RoundSelectorProps> = ({
  rounds,
  selectedRound,
  onSelect,
  className = "",
}) => {
  const ROUND_SELECTOR_PILL_MIN_WIDTH = 48;
  const t = useTranslations("competitions");

  // Dynamic visible count logic for desktop
  const pillMinWidth = ROUND_SELECTOR_PILL_MIN_WIDTH + 8; // px (minWidth + px-4 padding)
  const pillSpacing = 8; // px (space-x-2)
  const MAX_VISIBLE = 8;
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
          Math.floor((available + pillSpacing) / (pillMinWidth + pillSpacing)),
        ),
      );
      setVisibleCount(count);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Ensure selected round is always visible when it changes
  useEffect(() => {
    if (selectedRound === null) return;
    const idx = rounds.indexOf(selectedRound);
    if (idx === -1) return;
    if (idx < startIdx) setStartIdx(idx);
    else if (idx >= startIdx + visibleCount) {
      setStartIdx(Math.max(0, idx - visibleCount + 1));
    }
  }, [selectedRound, rounds, visibleCount]);

  const canScrollLeft = startIdx > 0;
  const canScrollRight = endIdx < rounds.length;

  const handleLeft = () => setStartIdx((prev) => Math.max(0, prev - 1));
  const handleRight = () =>
    setStartIdx((prev) => Math.min(rounds.length - visibleCount, prev + 1));

  if (rounds.length === 0) return null;

  return (
    <div className={cn("mb-4", className)}>
      {/* Mobile: Dropdown */}
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

      {/* Desktop: Carousel */}
      <div
        className="hidden md:flex items-center justify-center space-x-2 px-0 py-2"
        ref={containerRef}
      >
        {/* Left Arrow Button */}
        <PillButton
          variant="carouselArrow"
          size="icon"
          onClick={handleLeft}
          disabled={!canScrollLeft}
          aria-label={t("roundSelector.scrollLeft")}
        >
          <ChevronLeft className="w-5 h-5" />
        </PillButton>

        {/* Pills Row */}
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

        {/* Right Arrow Button */}
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
};

export default RoundSelector;
