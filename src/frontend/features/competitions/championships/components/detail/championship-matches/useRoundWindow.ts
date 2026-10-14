// src/frontend/features/competitions/championships/components/detail/championship-matches/useRoundWindow.ts
import { useEffect, useRef, useState } from "react";

import { visibleRoundCount, windowStartShowing } from "./roundWindow";

/**
 * The window of rounds a carousel shows: as many as fit its width, kept on
 * the selected round, and moved one round at a time by the arrows.
 *
 * @param rounds - every round, sorted
 * @param selectedRound - the chosen round, `null` before one is chosen
 * @returns the ref for the carousel, the rounds to show, and the arrows' state and handlers
 */
export function useRoundWindow(
  rounds: readonly number[],
  selectedRound: number | null,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [start, setStart] = useState(0);
  const end = Math.min(start + visibleCount, rounds.length);

  useEffect(() => {
    function update() {
      const container = containerRef.current;
      if (container) setVisibleCount(visibleRoundCount(container.offsetWidth));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // The functional setter returns `prev` unchanged when the round is already
  // shown, so React bails out instead of re-rendering.
  useEffect(() => {
    if (selectedRound === null) return;
    const index = rounds.indexOf(selectedRound);
    if (index === -1) return;
    setStart((prev) => windowStartShowing(prev, index, visibleCount));
  }, [selectedRound, rounds, visibleCount]);

  return {
    containerRef,
    visibleRounds: rounds.slice(start, end),
    canScrollLeft: start > 0,
    canScrollRight: end < rounds.length,
    scrollLeft: () => setStart((prev) => Math.max(0, prev - 1)),
    scrollRight: () =>
      setStart((prev) => Math.min(rounds.length - visibleCount, prev + 1)),
  };
}
