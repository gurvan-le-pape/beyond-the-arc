// src/frontend/features/matches/utils/eventHelpers.ts
import { Circle } from "lucide-react";

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
 *
 * @param eventType - the raw event type from the API
 * @returns the display config; an unrecognised type falls back to a neutral marker rather than throwing
 */
export function getEventStyle(eventType: string): EventStyle {
  const configured: Omit<EventStyle, "color"> | undefined = (
    eventConfig as Record<string, Omit<EventStyle, "color"> | undefined>
  )[eventType];

  const base = configured ?? {
    icon: Circle,
    eventCategory: EventCategory.OTHER,
  };

  return { ...base, color: EVENT_CATEGORY_COLOR[base.eventCategory] };
}

// ---------------------------------------------------------------------------
// Team-id resolution
// ---------------------------------------------------------------------------

/**
 * Extracts the owning team-id from an event via its player roles.
 *
 * @param event - the event to attribute
 * @returns the owning team's id, or `undefined` when no player in a qualifying role is present
 */
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
 * Derives the 1-based quarter number (1–4, 5 = OT) from the instant an event
 * occurred, relative to the match start (10-min quarters, 600s each).
 *
 * @param occurredAt - when the event happened
 * @param matchDate - the match's start instant, the origin all quarters are measured from
 * @returns 1–4 for regulation, 5 for anything past it — every overtime period collapses into 5
 */
export function getQuarterFromTimestamp(
  occurredAt: Date | string,
  matchDate: Date | string,
): number {
  const elapsedSeconds =
    (new Date(occurredAt).getTime() - new Date(matchDate).getTime()) / 1000;

  if (elapsedSeconds <= 600) return 1;
  if (elapsedSeconds <= 1200) return 2;
  if (elapsedSeconds <= 1800) return 3;
  if (elapsedSeconds <= 2400) return 4;
  return 5; // OT
}

// ---------------------------------------------------------------------------
// Points calculation
// ---------------------------------------------------------------------------

/**
 * The point value implied by an event type.
 *
 * @param eventType - the raw event type
 * @param style - its resolved display config, whose category decides the two-point case
 * @returns 3, 2, 1 or 0 — a non-scoring event is 0, never negative
 */
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
 *
 * @param events - every event in the match, scoring or not
 * @param homeTeamId - id used to attribute a scoring event to the home side
 * @param awayTeamId - id used to attribute a scoring event to the away side
 * @param matchDate - the match's start instant; every quarter boundary is measured from it
 * @returns five-slot arrays per side: indices 0–3 are Q1–Q4 and index 4 is all overtime combined
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

    const quarter = getQuarterFromTimestamp(event.occurredAt, matchDate);
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
 * **Returns data, not markup.** Rendering an HTML string here would put the
 * timeline's safety on the description never containing anything tag-shaped —
 * an invariant owned by the simulator rather than by this file. Tokens let
 * React build the anchors instead.
 *
 * The description is scanned **once, left to right, consuming each hit** before
 * continuing. Repeated whole-string replacement would re-scan text it had
 * already rewritten, so a player whose name occurs inside another's would be
 * wrapped twice and the anchors would nest.
 *
 * @param description - the event's sentence, as the simulator wrote it
 * @param eventPlayers - the players to recognise; absent or empty yields a single text token
 * @returns the description as alternating text and player runs, for the caller to render
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
