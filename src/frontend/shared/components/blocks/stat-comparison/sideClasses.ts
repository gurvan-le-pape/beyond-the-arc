// src/frontend/shared/components/blocks/stat-comparison/sideClasses.ts

/**
 * Static Tailwind class lookups per side (avoids dynamic class construction),
 * in the home and away tones: side A is the home team or the first player.
 */
export const SIDE_CLASSES = {
  A: {
    text: "text-ink-home",
    bg: "bg-solid-home",
    label: "text-ink-home",
  },
  B: {
    text: "text-ink-away",
    bg: "bg-solid-away",
    label: "text-ink-away",
  },
} as const;
