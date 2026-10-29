// src/frontend/shared/components/primitives/SegmentedControl.tsx
"use client";

import { type KeyboardEvent, type ReactNode, useRef } from "react";

import { segmentGroupClass, segmentOptionVariants } from "./segmentedStyles";

export interface SegmentedControlOption<TValue extends string> {
  readonly value: TValue;
  readonly label: ReactNode;
}

// Arrow keys move to the next or previous option, wrapping; Home and End jump
// to the ends. Both axes, since the group wraps onto several lines when narrow.
function nextIndex(key: string, index: number, count: number) {
  const last = count - 1;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return index === last ? 0 : index + 1;
    case "ArrowLeft":
    case "ArrowUp":
      return index === 0 ? last : index - 1;
    case "Home":
      return 0;
    case "End":
      return last;
    default:
      return undefined;
  }
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
 * A WAI-ARIA radio group: one tab stop (the selected option), arrow keys move
 * the selection, and a screen reader announces the group and which option is
 * checked. For an on/off setting use `Switch`; for a choice among many, a
 * select.
 */
export function SegmentedControl<TValue extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
}: SegmentedControlProps<TValue>) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasSelection = options.some((option) => option.value === value);

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const next = nextIndex(event.key, index, options.length);
    if (next === undefined) return;
    event.preventDefault();
    onChange(options[next].value);
    optionRefs.current[next]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} className={segmentGroupClass}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            // Roving tab stop: the group is one stop in the tab order. With
            // nothing selected, the first option takes it.
            tabIndex={isSelected || (!hasSelection && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={segmentOptionVariants({ size, selected: isSelected })}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
