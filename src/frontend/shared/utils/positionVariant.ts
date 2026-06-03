// src/frontend/shared/utils/positionVariant.ts
import { Position } from "@/shared/constants";

import type { BadgeProps } from "../components/primitives";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function positionVariant(
  position: string | undefined,
): BadgeProps["variant"] {
  switch (position) {
    case Position.PG:
    case Position.SG:
      return "position-g";
    case Position.SF:
    case Position.PF:
      return "position-f";
    case Position.C:
      return "position-c";
    default:
      return "default";
  }
}
