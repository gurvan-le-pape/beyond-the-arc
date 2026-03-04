// src/frontend/features/competitions/components/navigation/RoundSelector.tsx
"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { Button, Select } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

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
          value={selectedRound?.toString() ?? ""}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="w-full"
        >
          {rounds.map((round) => (
            <option key={round} value={round}>
              {t("roundSelector.dropdownLabel", { round })}
            </option>
          ))}
        </Select>
      </div>

      {/* Desktop: Carousel */}
      <div
        className="hidden md:flex items-center justify-center space-x-2 px-0 py-2"
        ref={containerRef}
      >
        {/* Left Arrow Button */}
        <Button
          variant="carouselArrow"
          size="icon"
          onClick={handleLeft}
          disabled={!canScrollLeft}
          aria-label={t("roundSelector.scrollLeft")}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>

        {/* Pills Row */}
        <div className="flex space-x-2">
          {rounds.slice(startIdx, endIdx).map((round) => {
            const isActive = selectedRound === round;
            return (
              <Button
                key={round}
                variant={isActive ? "pillActive" : "pillInactive"}
                size="pill"
                onClick={() => onSelect(round)}
                style={{ minWidth: ROUND_SELECTOR_PILL_MIN_WIDTH }}
                aria-pressed={isActive}
                aria-label={t("roundSelector.pillLabel", { round })}
              >
                {t("roundSelector.pillLabel", { round })}
              </Button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <Button
          variant="carouselArrow"
          size="icon"
          onClick={handleRight}
          disabled={!canScrollRight}
          aria-label={t("roundSelector.scrollRight")}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default RoundSelector;
