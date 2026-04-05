// src/frontend/shared/constants/levelConfig.ts
// src/shared/constants/levelConfig.ts
export const LEVEL_CONFIG = {
  departmental: {
    border: "border-l-departmental-DEFAULT dark:border-l-departmental-light",
    bg: "bg-departmental-light/20 dark:bg-departmental-dark/20",
    badgeVariant: "departmental" as const,
  },
  regional: {
    border: "border-l-regional-DEFAULT dark:border-l-regional-light",
    bg: "bg-regional-light/20 dark:bg-regional-dark/20",
    badgeVariant: "regional" as const,
  },
  national: {
    border: "border-l-national-DEFAULT dark:border-l-national-light",
    bg: "bg-national-light/20 dark:bg-national-dark/20",
    badgeVariant: "national" as const,
  },
  default: {
    border: "border-l-divide-light dark:border-l-divide-dark",
    bg: "bg-surface-subtle dark:bg-surface-subtle-dark/50",
    badgeVariant: "default" as const,
  },
} as const;
