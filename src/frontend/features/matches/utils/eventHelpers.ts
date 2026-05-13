// src/frontend/features/matches/utils/eventHelpers.ts
import { eventConfig } from "@/features/matches/constants";
import type { EventStyle, MatchEvent } from "@/features/matches/types";
import { EventCategory, EventType, Role } from "@/shared/constants";

// ---------------------------------------------------------------------------
// Event-style lookup
// ---------------------------------------------------------------------------

/** Returns display config (icon, color, label, category) for a given event type. */
export function getEventStyle(eventType: string): EventStyle {
  return (
    eventConfig[eventType] || {
      icon: "⚪",
      color: "text-text-muted",
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

/**
 * Derives the 1-based quarter number (1–4, 5 = OT) from an event timestamp
 * relative to the match start date (10-min quarters, 600s each).
 */
export function getQuarterFromTimestamp(
  eventTimestamp: Date | string,
  matchDate: Date | string,
): number {
  const elapsedSeconds =
    (new Date(eventTimestamp).getTime() - new Date(matchDate).getTime()) / 1000;

  if (elapsedSeconds <= 600) return 1;
  if (elapsedSeconds <= 1200) return 2;
  if (elapsedSeconds <= 1800) return 3;
  if (elapsedSeconds <= 2400) return 4;
  return 5; // OT
}

// ---------------------------------------------------------------------------
// Points calculation
// ---------------------------------------------------------------------------

/** Returns the point value implied by an event type. */
export function pointsForEvent(eventType: string, style: EventStyle): number {
  if (eventType.includes("three") || eventType === EventType.THREE_POINT_AND_1)
    return 3;
  if (eventType.includes("free_throw")) return 1;
  if (style.eventCategory === EventCategory.MADE) return 2;
  return 0;
}

// ---------------------------------------------------------------------------
// Quarter scores
// ---------------------------------------------------------------------------

export interface QuarterScores {
  home: [number, number, number, number, number]; // Q1–Q4 + OT
  away: [number, number, number, number, number];
}

/**
 * Computes per-quarter scores for both teams by bucketing scoring events
 * relative to the match start time.
 * Index 0–3 = Q1–Q4, index 4 = OT.
 */
export function computeQuarterScores(
  events: MatchEvent[],
  homeTeamId: number,
  awayTeamId: number,
  matchDate: Date,
): QuarterScores {
  const home: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  const away: [number, number, number, number, number] = [0, 0, 0, 0, 0];

  for (const event of events) {
    const style = getEventStyle(event.eventType);
    if (style.eventCategory !== EventCategory.MADE) continue;

    const points = pointsForEvent(event.eventType, style);
    if (points === 0) continue;

    const quarter = getQuarterFromTimestamp(event.timestamp, matchDate);
    const idx = Math.min(quarter - 1, 4); // clamp OT+ to index 4

    const teamId = getTeamIdFromEvent(event);
    if (teamId === homeTeamId) home[idx] += points;
    else if (teamId === awayTeamId) away[idx] += points;
  }

  return { home, away };
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
    result = result.replaceAll(
      new RegExp(player.name, "g"),
      `<span class="text-primary hover:underline cursor-pointer match-player-link" data-player-id="${player.id}" tabIndex="0" role="button">${player.name}</span>`,
    );
  });
  return result;
}
