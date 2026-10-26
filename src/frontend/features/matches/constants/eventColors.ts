// src/frontend/features/matches/constants/eventColors.ts
import { EventCategory } from "@/shared/constants";

/**
 * The colour of a match event is a property of its **category**, not of the
 * event type. A hand-picked Tailwind palette value per entry — there are 40 in
 * `eventConfig` — is how colours come to fail WCAG AA in one theme and not the
 * other, and the dark-only failures are the ones nobody looks at.
 *
 * Deriving it here means a new event type cannot arrive with a wrong, missing,
 * or raw-palette colour: it picks up its category's colour or it does not
 * compile.
 *
 * The tokens themselves were solved rather than chosen (see globals.css): each
 * is the most saturated colour at its hue that still clears 4.5:1 on that
 * theme's `surface-subtle`, and every pair is at least 23 CIE76 dE apart —
 * the distance below which two labels stop being separable at text size.
 *
 * One consequence worth knowing before "correcting" it: `foul` reads olive in
 * the light theme rather than amber. Yellow has to go dark to clear AA on a
 * light surface, and dark yellow is olive. It is amber in both dark themes,
 * where it has room to be.
 */
// The clock events' colour, which the categories that are not an action share.
const NEUTRAL = "text-event-game";

export const EVENT_CATEGORY_COLOR: Record<EventCategory, string> = {
  [EventCategory.MADE]: "text-event-made",
  [EventCategory.MISS]: "text-event-miss",
  [EventCategory.FOUL]: "text-event-foul",
  [EventCategory.TURNOVER]: "text-event-turnover",
  [EventCategory.DEFENSIVE]: "text-event-defensive",
  [EventCategory.REBOUND]: "text-event-rebound",
  [EventCategory.SUBSTITUTION]: "text-event-substitution",
  [EventCategory.GAME]: NEUTRAL,
  // A restart, not an action.
  [EventCategory.INBOUND]: NEUTRAL,
  // Unconfigured event types.
  [EventCategory.OTHER]: NEUTRAL,
};
