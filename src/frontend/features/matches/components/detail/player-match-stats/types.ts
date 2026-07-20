// src/frontend/features/matches/components/detail/player-match-stats/types.ts
import type { ReactNode } from "react";

import type { MatchPlayerWithStats } from "@/features/matches/types";

/** Column definition for the player match stats table. */
export interface StatColumn {
  id: string;
  label?: string;
  tooltip?: string;
  align?: "left" | "center" | "right";
  getValue: (player: MatchPlayerWithStats) => string | number | ReactNode;
  className?: string;
}
