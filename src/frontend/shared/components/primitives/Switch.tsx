// src/frontend/shared/components/primitives/Switch.tsx
"use client";

import { Switch as AriaSwitch } from "react-aria-components";

import { cn } from "@/shared/utils";

const SIZES = {
  sm: { track: "h-5 w-9", thumb: "h-3.5 w-3.5", on: "translate-x-4" },
  md: { track: "h-6 w-11", thumb: "h-4 w-4", on: "translate-x-6" },
  lg: { track: "h-8 w-16", thumb: "h-6 w-6", on: "translate-x-9" },
} as const;

export interface SwitchProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  /** Shown before the track, and the switch's accessible name. */
  readonly label: string;
  readonly size?: keyof typeof SIZES;
}

/**
 * Switch — an on/off setting, on React Aria's Switch over a native checkbox
 * with the switch role.
 *
 * The label and the track share one `<label>`, so clicking either toggles it
 * and the label names it. Use for on/off settings and preferences; for
 * switching between views, a `SegmentedControl`.
 *
 * @example
 * <Switch checked={latestFirst} onCheckedChange={setLatestFirst} label="Latest first" size="sm" />
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  size = "md",
}: SwitchProps) {
  const s = SIZES[size];

  return (
    <AriaSwitch
      isSelected={checked}
      onChange={onCheckedChange}
      className="group focus-ring inline-flex cursor-pointer items-center gap-2 rounded-sm text-sm text-text-secondary"
    >
      {label}
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full bg-divide transition-colors",
          "group-data-[selected]:bg-solid-primary",
          s.track,
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-surface-raised shadow-sm transition-transform",
            checked ? s.on : "translate-x-1",
            s.thumb,
          )}
        />
      </span>
    </AriaSwitch>
  );
}
