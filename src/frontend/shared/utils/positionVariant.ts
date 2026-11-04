// src/frontend/shared/utils/positionVariant.ts
import { Position } from "@/shared/constants";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Picks the badge variant for a player's listed position.
 *
 * **Accepts any string, not the `Position` enum**, because the value arrives
 * from the API unvalidated and a player may have none recorded at all. Anything
 * unrecognised — including `undefined` — takes the neutral `default` badge
 * rather than throwing, so an unexpected position degrades the badge instead of
 * the page.
 *
 * The five positions collapse to **three** variants: point and shooting guards
 * share one, small and power forwards share another, and centre has its own.
 * Distinguishing PG from SG in the UI therefore needs a new variant, not a new
 * case here.
 *
 * @param position - the position as recorded, or nothing
 * @returns the matching badge variant, or `default` for anything unrecognised
 */
export function positionVariant(
  position: string | undefined,
): "position-g" | "position-f" | "position-c" | "default" {
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
