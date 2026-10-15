// src/frontend/shared/constants/levelConfig.ts

export const LEVEL_CONFIG = {
  departmental: {
    bg: "bg-tint-departmental",
    border: "border-solid-departmental",
    text: "text-ink-departmental",
    badgeVariant: "departmental-on-header" as const,
    hover:
      "hover:border-line-departmental hover:shadow-[0_0_0_1px_rgb(var(--color-solid-departmental))]",
  },

  regional: {
    bg: "bg-tint-regional",
    border: "border-solid-regional",
    text: "text-ink-regional",
    badgeVariant: "regional-on-header" as const,
    hover:
      "hover:border-line-regional hover:shadow-[0_0_0_1px_rgb(var(--color-solid-regional))]",
  },

  national: {
    bg: "bg-tint-national",
    border: "border-solid-national",
    text: "text-ink-national",
    badgeVariant: "national-on-header" as const,
    hover:
      "hover:border-line-national hover:shadow-[0_0_0_1px_rgb(var(--color-solid-national))]",
  },

  default: {
    bg: "bg-surface-inset",
    border: "border-divide",
    text: "text-text-secondary",
    badgeVariant: "default" as const,
    hover: "hover:border-divide",
  },
} as const;

export type LevelKey = keyof typeof LEVEL_CONFIG;
