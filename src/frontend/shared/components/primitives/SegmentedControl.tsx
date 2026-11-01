// src/frontend/shared/components/primitives/SegmentedControl.tsx
"use client";

import type { ReactNode } from "react";
import { Radio, RadioGroup } from "react-aria-components";

import { cn } from "@/shared/utils";

import { segmentGroupClass, segmentOptionVariants } from "./segmentedStyles";

export interface SegmentedControlOption<TValue extends string> {
  readonly value: TValue;
  readonly label: ReactNode;
}

interface SegmentedControlProps<TValue extends string> {
  /** What is being chosen — the group's accessible name ("Quarter", "Shots"). */
  readonly label: string;
  readonly options: readonly SegmentedControlOption<TValue>[];
  readonly value: TValue;
  readonly onChange: (value: TValue) => void;
  readonly size?: "sm" | "md";
}

/**
 * One choice among a few, all visible at once — a quarter, a shot filter, a
 * colour scale.
 *
 * React Aria's radio group, over native radio inputs: one tab stop (the
 * selected option), the arrow keys move the selection, and a screen reader
 * announces the group and which option is checked. For an on/off setting use
 * `Switch`; for a choice among many, a select.
 */
export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
}: SegmentedControlProps<TValue>) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onChange={(next) => onChange(next as TValue)}
      orientation="horizontal"
      className={segmentGroupClass}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className={({ isSelected }) =>
            cn(
              segmentOptionVariants({ size, selected: isSelected }),
              "cursor-pointer",
            )
          }
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
