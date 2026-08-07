// src/frontend/features/organizations/types/OrganizationCounts.ts
import type { Stats } from "@/features/stats/types";

/**
 * The three entity counts the organizations landing page shows, narrowed from
 * the platform-wide stats the backend already returns. Derived from the
 * generated contract so a rename upstream breaks the build here.
 */
export type OrganizationCounts = Pick<
  Stats,
  "leagues" | "committees" | "clubs"
>;
