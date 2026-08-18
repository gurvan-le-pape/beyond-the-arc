// src/frontend/shared/components/blocks/stat-comparison/StatValue.tsx
"use client";

import { cn } from "@/shared/utils";

import { SIDE_CLASSES } from "./sideClasses";

interface StatValueProps {
  readonly value: string | number;
  readonly winner: "A" | "B" | "tie";
  readonly side: "A" | "B";
  readonly isDual: boolean;
  readonly delayMs: number;
  readonly align: "left" | "right";
}

/**
 * One side's value in a comparison row, styled by whether it won.
 *
 * The two variants mark the winner differently and that is the whole of the
 * difference: **dual** underlines the winning value and draws no bar here,
 * while **mirrored** colours it and grows a full-width pill beneath it. Passing
 * `isDual` therefore changes what renders, not just how it looks.
 *
 * The pill starts 300ms after `delayMs`, so a row's value settles before its
 * bar moves.
 */
export function StatValue({
  value,
  winner,
  side,
  isDual,
  delayMs,
  align,
}: StatValueProps) {
  const isWinner = winner === side;
  const classes = SIDE_CLASSES[side];

  const mirroredValueClass = isWinner ? classes.text : "text-text-body";
  const valueClass = isDual
    ? cn("text-text-heading", isWinner && `border-b-2 pb-0.5 ${classes.border}`)
    : cn(mirroredValueClass);

  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <span
        className={cn(
          "inline-block text-sm font-bold tabular-nums transition-colors duration-300",
          valueClass,
        )}
      >
        {value}
      </span>
      {!isDual && (
        <div
          className={cn(
            "h-1.5 rounded-full mt-1 transition-all duration-500",
            isWinner ? classes.bg : "bg-transparent",
          )}
          style={{
            width: isWinner ? "100%" : "0%",
            transitionDelay: `${delayMs + 300}ms`,
          }}
        />
      )}
    </div>
  );
}

export default StatValue;
