// src/frontend/shared/constants/levelConfig.ts

export const LEVEL_CONFIG = {
  departmental: {
    bg: "bg-departmental-subtle",
    border: "border-departmental",
    text: "text-departmental-strong",
    badgeVariant: "departmental-on-header" as const,
    hover:
      "hover:border-departmental/40 hover:shadow-[0_0_0_1px_var(--color-departmental)]",
  },

  regional: {
    bg: "bg-regional-subtle",
    border: "border-regional",
    text: "text-regional-strong",
    badgeVariant: "regional-on-header" as const,
    hover:
      "hover:border-regional/40 hover:shadow-[0_0_0_1px_var(--color-regional)]",
  },

  national: {
    bg: "bg-national-subtle",
    border: "border-national",
    text: "text-national-strong",
    badgeVariant: "national-on-header" as const,
    hover:
      "hover:border-national/40 hover:shadow-[0_0_0_1px_var(--color-national)]",
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
