// src/frontend/shared/components/blocks/stat-comparison/sideClasses.ts

/** Static Tailwind class lookups per side (avoids dynamic class construction). */
export const SIDE_CLASSES = {
  A: {
    text: "text-primary",
    border: "border-primary",
    bg: "bg-primary",
    label: "text-primary",
  },
  B: {
    text: "text-secondary",
    border: "border-secondary",
    bg: "bg-secondary",
    label: "text-secondary",
  },
} as const;
