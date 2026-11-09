// src/frontend/features/organizations/components/CountBar.tsx
import { cn } from "@/shared/utils";

const TONES = {
  regional: { track: "bg-tint-regional", fill: "bg-solid-regional" },
  departmental: {
    track: "bg-tint-departmental",
    fill: "bg-solid-departmental",
  },
} as const;

interface CountBarProps {
  readonly value: number;
  /** The largest value in the list, which fills the track. */
  readonly max: number;
  readonly tone: keyof typeof TONES;
  readonly className?: string;
}

/**
 * A count drawn as a bar against the largest one in its list, so a column of
 * club counts reads as a ranking at a glance. Decorative: the number beside it
 * carries the value.
 */
export function CountBar({ value, max, tone, className }: CountBarProps) {
  const { track, fill } = TONES[tone];
  const width = max > 0 ? (value / max) * 100 : 0;

  return (
    <div
      className={cn("h-1.5 rounded-full overflow-hidden", track, className)}
      aria-hidden="true"
    >
      <div
        className={cn("h-full rounded-full", fill)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
