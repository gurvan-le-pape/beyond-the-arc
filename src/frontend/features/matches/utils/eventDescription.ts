// src/frontend/features/matches/utils/eventDescription.ts
import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

/** A message under `matches.matchEvents.descriptions`. */
export type EventDescriptionKey =
  | "shotMade"
  | "shotMadeAssisted"
  | "shotMissed"
  | "freeThrowMade"
  | "freeThrowMissed"
  | "andOne"
  | "shootingFoul"
  | "foul"
  | "technicalFoul"
  | "steal"
  | "block"
  | "rebound"
  | "inbound"
  | "turnover"
  | "substitution"
  | "tipOff"
  | "quarterEnd"
  | "shotClock";

/** The sentence for one event: which message, and the names it takes. */
export interface EventDescription {
  readonly key: EventDescriptionKey;
  /** Player names by the placeholder each message uses (`shooter`, `victim`…). */
  readonly values: Readonly<Record<string, string>>;
}

/** A sentence: its message, and which player role fills each placeholder. */
interface Sentence {
  readonly key: EventDescriptionKey;
  readonly roles: Readonly<Record<string, string>>;
}

const SHOOTER = { shooter: Role.SHOOTER };
const FOULER_ON_VICTIM = { fouler: Role.FOULER, victim: Role.VICTIM };
const FOULER_ON_SHOOTER = { fouler: Role.FOULER, shooter: Role.SHOOTER };

/** Every event type with a sentence, except the made and missed shots. */
const SENTENCES: Readonly<Record<string, Sentence>> = {
  [EventType.FREE_THROW_MADE]: { key: "freeThrowMade", roles: SHOOTER },
  [EventType.FREE_THROW_MISSED]: { key: "freeThrowMissed", roles: SHOOTER },
  [EventType.THREE_POINT_AND_1]: { key: "andOne", roles: FOULER_ON_SHOOTER },
  [EventType.TWO_POINT_EXT_AND_1]: { key: "andOne", roles: FOULER_ON_SHOOTER },
  [EventType.TWO_POINT_INT_AND_1]: { key: "andOne", roles: FOULER_ON_SHOOTER },
  [EventType.THREE_POINT_SHOOTING_FOUL]: {
    key: "shootingFoul",
    roles: FOULER_ON_SHOOTER,
  },
  [EventType.TWO_POINT_EXT_SHOOTING_FOUL]: {
    key: "shootingFoul",
    roles: FOULER_ON_SHOOTER,
  },
  [EventType.TWO_POINT_INT_SHOOTING_FOUL]: {
    key: "shootingFoul",
    roles: FOULER_ON_SHOOTER,
  },
  [EventType.OFFENSIVE_FOUL]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.CHARGING_FOUL]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.ILLEGAL_SCREEN]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.BLOCKING_FOUL]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.PUSHING_FOUL]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.REACHING_FOUL]: { key: "foul", roles: FOULER_ON_VICTIM },
  [EventType.TECHNICAL_FOUL]: {
    key: "technicalFoul",
    roles: { fouler: Role.FOULER },
  },
  [EventType.STEAL]: {
    key: "steal",
    roles: { stealer: Role.STEALER, victim: Role.VICTIM },
  },
  [EventType.BLOCKED_SHOT]: {
    key: "block",
    roles: { blocker: Role.BLOCKER, blocked: Role.BLOCKED },
  },
  [EventType.OFFENSIVE_REBOUND]: {
    key: "rebound",
    roles: { rebounder: Role.REBOUNDER },
  },
  [EventType.DEFENSIVE_REBOUND]: {
    key: "rebound",
    roles: { rebounder: Role.REBOUNDER },
  },
  [EventType.INBOUND]: { key: "inbound", roles: SHOOTER },
  [EventType.TRAVELING]: { key: "turnover", roles: SHOOTER },
  [EventType.CARRYING]: { key: "turnover", roles: SHOOTER },
  [EventType.DOUBLE_DRIBBLE]: { key: "turnover", roles: SHOOTER },
  [EventType.BAD_PASS]: { key: "turnover", roles: SHOOTER },
  [EventType.SUBSTITUTION]: {
    key: "substitution",
    roles: { entering: Role.ENTERING_PLAYER, exiting: Role.EXITING_PLAYER },
  },
  [EventType.TIP_OFF]: { key: "tipOff", roles: { winner: Role.WINNER } },
  [EventType.QUARTER_END]: { key: "quarterEnd", roles: {} },
  [EventType.SHOT_CLOCK_VIOLATION]: { key: "shotClock", roles: {} },
};

function sentenceFor(
  eventType: string,
  assisted: boolean,
): Sentence | undefined {
  if (eventType.startsWith("made_")) {
    return assisted
      ? {
          key: "shotMadeAssisted",
          roles: { ...SHOOTER, assister: Role.ASSISTER },
        }
      : { key: "shotMade", roles: SHOOTER };
  }
  if (eventType.startsWith("missed_")) {
    return { key: "shotMissed", roles: SHOOTER };
  }
  return SENTENCES[eventType];
}

/**
 * The message and names that describe a match event, built from its type and
 * its players' roles.
 *
 * The event's label (`eventLabels`) already names the action — "Layup réussi"
 * — so the sentence says who did it and to whom: "X marque sur une passe de
 * Y". The roles per type are the simulator's (`event_generator.py`): an
 * inbound and a ball-handling turnover name their player `shooter`, a block
 * names its victim `blocked`.
 *
 * @param event - the event to describe
 * @returns the description, or `null` for a type this does not know or an event missing a player its sentence needs — the caller shows the label alone
 */
export function describeEvent(
  event: Pick<MatchEvent, "eventType" | "players">,
): EventDescription | null {
  const nameOf = (role: string): string | undefined =>
    event.players?.find((p) => p.role === role)?.player.name;

  const sentence = sentenceFor(
    event.eventType,
    nameOf(Role.ASSISTER) !== undefined,
  );
  if (!sentence) return null;

  const values: Record<string, string> = {};
  for (const [placeholder, role] of Object.entries(sentence.roles)) {
    const name = nameOf(role);
    if (!name) return null;
    values[placeholder] = name;
  }
  return { key: sentence.key, values };
}
