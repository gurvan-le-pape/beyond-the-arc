// src/frontend/features/matches/utils/eventHelpers.ts
import { eventConfig } from "@/features/matches/constants/eventConfig";
import type { EventStyle } from "@/features/matches/types/EventStyle";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { EventCategory } from "@/shared/constants/event-categories";
import { EventType } from "@/shared/constants/event-types";
import { Role } from "@/shared/constants/roles";

// ---------------------------------------------------------------------------
// Event-style lookup
// ---------------------------------------------------------------------------

/** Returns display config (icon, color, label, category) for a given event type. */
export function getEventStyle(eventType: string): EventStyle {
  return (
    eventConfig[eventType] || {
      icon: "⚪",
      color: "text-gray-600 dark:text-gray-400",
      labelKey: "",
      eventCategory: EventCategory.OTHER,
    }
  );
}

// ---------------------------------------------------------------------------
// Team-id resolution
// ---------------------------------------------------------------------------

/** Extracts the owning team-id from an event via its player roles. */
export function getTeamIdFromEvent(event: MatchEvent): number | undefined {
  // Substitution events – either the exiting or entering player owns the team.
  if (event.eventType === EventType.SUBSTITUTION) {
    const player = event.players?.find((p) =>
      ([Role.EXITING_PLAYER, Role.ENTERING_PLAYER] as Role[]).includes(p.role),
    );
    return player?.player.team.id;
  }

  // All other events – the "primary actor" owns the team.
  const primaryPlayer = event.players?.find((p) =>
    (
      [
        Role.SHOOTER,
        Role.FOULER,
        Role.REBOUNDER,
        Role.ASSISTER,
        Role.STEALER,
        Role.WINNER,
      ] as Role[]
    ).includes(p.role),
  );
  return primaryPlayer?.player.team.id;
}

// ---------------------------------------------------------------------------
// Quarter derivation
// ---------------------------------------------------------------------------

/** Derives the 1-based quarter number from a timestamp relative to match start (10-min quarters). */
export function getQuarterFromTimestamp(
  timestamp: string,
  matchStartTime: string,
): number {
  const elapsedMinutes =
    (new Date(timestamp).getTime() - new Date(matchStartTime).getTime()) /
    (1000 * 60);

  if (elapsedMinutes <= 10) return 1;
  if (elapsedMinutes <= 20) return 2;
  if (elapsedMinutes <= 30) return 3;
  return 4;
}

// ---------------------------------------------------------------------------
// Points calculation
// ---------------------------------------------------------------------------

/** Returns the point value implied by an event type. */
export function pointsForEvent(eventType: string, style: EventStyle): number {
  if (eventType.includes("three") || eventType === EventType.THREE_POINT_AND_1)
    return 3;
  if (eventType.includes("free_throw")) return 1;
  if (style.eventCategory === EventCategory.SCORING) return 2;
  return 0;
}

// ---------------------------------------------------------------------------
// Clickable description builder
// ---------------------------------------------------------------------------

/**
 * Replaces player names inside a description string with clickable <span> elements.
 *
 * NOTE: the returned string is consumed via dangerouslySetInnerHTML.  This is
 * safe as long as `description` originates from a trusted back-end source and
 * is not user-supplied.  If that assumption ever changes, switch to a
 * React-based token renderer.
 */
export function makeDescriptionClickable(
  description: string,
  eventPlayers?: MatchEvent["players"],
): string {
  if (!eventPlayers || eventPlayers.length === 0) return description;

  let result = description;
  eventPlayers.forEach(({ player }) => {
    result = result.replace(
      new RegExp(player.name, "g"),
      `<span class="text-primary-600 dark:text-primary-400 hover:underline cursor-pointer match-player-link" data-player-id="${player.id}" tabIndex="0" role="button">${player.name}</span>`,
    );
  });
  return result;
}
