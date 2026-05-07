// src/frontend/shared/constants/levelConfig.ts
export const LEVEL_CONFIG = {
  departmental: {
    border: "border-l-departmental",
    bg: "bg-departmental-subtle",
    badgeVariant: "departmental" as const,
  },
  regional: {
    border: "border-l-regional",
    bg: "bg-regional-subtle",
    badgeVariant: "regional" as const,
  },
  national: {
    border: "border-l-national",
    bg: "bg-national-subtle",
    badgeVariant: "national" as const,
  },
  default: {
    border: "border-l-divide",
    bg: "bg-surface-inset",
    badgeVariant: "default" as const,
  },
} as const;
