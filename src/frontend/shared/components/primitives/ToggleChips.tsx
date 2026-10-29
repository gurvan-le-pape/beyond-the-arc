// src/frontend/shared/components/primitives/ToggleChips.tsx
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

export interface ToggleChipOption<TValue extends string> {
  readonly value: TValue;
  readonly label: ReactNode;
  /** How many items the chip stands for, shown after the label. */
  readonly count?: number;
  /**
   * A decorative mark before the label, such as a coloured dot keyed to the
   * items. Dimmed while the chip is off; hide it from assistive tech yourself.
   */
  readonly marker?: ReactNode;
}

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors duration-150 focus-ring",
  {
    variants: {
      selected: {
        true: "border-line-primary bg-tint-primary text-ink-primary font-semibold",
        false:
          "border-divide text-text-body font-medium hover:text-text-heading",
      },
    },
    defaultVariants: { selected: false },
  },
);

interface ToggleChipsProps<TValue extends string> {
  /** What the chips choose among — the group's accessible name. */
  readonly label: string;
  readonly options: readonly ToggleChipOption<TValue>[];
  readonly selected: ReadonlySet<TValue>;
  readonly onToggle: (value: TValue) => void;
}

/**
 * Several independent on/off choices, all visible at once — the kinds of item
 * a list shows, for instance.
 *
 * Each chip is a toggle button (`aria-pressed`) and its own tab stop, since
 * turning one on does not turn another off: for one choice among a few, use
 * `SegmentedControl`. Every combination is allowed, none included; what an
 * empty selection means is the caller's to say.
 */
export function ToggleChips<TValue extends string>({
  label,
  options,
  selected,
  onToggle,
}: ToggleChipsProps<TValue>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.has(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(option.value)}
            className={chipVariants({ selected: isSelected })}
          >
            {option.marker && (
              <span
                className={
                  isSelected ? "inline-flex" : "inline-flex opacity-40"
                }
              >
                {option.marker}
              </span>
            )}
            {option.label}
            {option.count !== undefined && (
              <span className="text-xs font-normal tabular-nums">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ToggleChips;
