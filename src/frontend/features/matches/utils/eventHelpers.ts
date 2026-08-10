// src/frontend/features/matches/utils/eventHelpers.ts
import {
  EVENT_CATEGORY_COLOR,
  eventConfig,
} from "@/features/matches/constants";
import type { EventStyle, MatchEvent } from "@/features/matches/types";
import { EventCategory, EventType, Role } from "@/shared/constants";

// ---------------------------------------------------------------------------
// Event-style lookup
// ---------------------------------------------------------------------------

/**
 * Returns display config (icon, color, label, category) for a given event type.
 *
 * `color` is derived from the category rather than stored per event type, so
 * the 40 entries in `eventConfig` cannot drift from each other or from the
 * contrast the tokens guarantee. See `eventColors.ts`.
 */
export function getEventStyle(eventType: string): EventStyle {
  const configured: Omit<EventStyle, "color"> | undefined = (
    eventConfig as Record<string, Omit<EventStyle, "color"> | undefined>
  )[eventType];

  const base = configured ?? {
    icon: "⚪",
    eventCategory: EventCategory.OTHER,
  };

  return { ...base, color: EVENT_CATEGORY_COLOR[base.eventCategory] };
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
  matchDate: Date | string,
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
// Description tokenizer
// ---------------------------------------------------------------------------

/** One run of a match-event description: plain text, or a player's name. */
export type EventDescriptionToken =
  | { readonly kind: "text"; readonly text: string }
  | {
      readonly kind: "player";
      readonly text: string;
      readonly playerId: number;
    };

/**
 * Splits a description into runs, marking the ones that are a player's name so
 * the caller can render them as links.
 *
 * This returns data rather than markup on purpose. The previous version built
 * an HTML string of `<a>` tags and the paragraph rendered it through
 * `dangerouslySetInnerHTML`, which meant the safety of the whole timeline
 * rested on the description never containing anything that looks like a tag —
 * an invariant owned by the simulator, not by this file.
 *
 * It also fixes a substitution bug that the string form could not: a name is
 * matched by scanning the description once, left to right, consuming each hit
 * before continuing. Repeated `replaceAll` passes re-scanned text they had
 * already rewritten, so a player whose name appears inside another's — or
 * inside the href or class of a link written by an earlier pass — was wrapped
 * twice, nesting anchors.
 */
export function tokenizeEventDescription(
  description: string,
  eventPlayers?: MatchEvent["players"],
): EventDescriptionToken[] {
  if (!eventPlayers || eventPlayers.length === 0)
    return [{ kind: "text", text: description }];

  // Longest first, so "Jean Martin" wins over "Martin" at the same index.
  // Deduplicated because an event lists a player once per role, and two
  // tokens for one name would be one link too many.
  const names = [
    ...new Map(eventPlayers.map(({ player }) => [player.name, player.id])),
  ].sort(([a], [b]) => b.length - a.length);

  const tokens: EventDescriptionToken[] = [];
  let pending = "";
  let index = 0;

  const flushPending = () => {
    if (pending) {
      tokens.push({ kind: "text", text: pending });
      pending = "";
    }
  };

  while (index < description.length) {
    const hit = names.find(([name]) => description.startsWith(name, index));

    if (hit) {
      const [name, playerId] = hit;
      flushPending();
      tokens.push({ kind: "player", text: name, playerId });
      index += name.length;
    } else {
      pending += description[index];
      index += 1;
    }
  }

  flushPending();
  return tokens;
}
