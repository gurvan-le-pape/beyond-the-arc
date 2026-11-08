// src/backend/common/constants/event-player-roles.ts
import { EventType } from "./event-types";
import { Role } from "./roles";

/**
 * The players an event names, as `[main, other]` roles by event type. An event
 * stores its main player in `match_events.player_id` and the other in
 * `other_player_id`; a null role is never set. The main player of a shot is
 * the one who took it, so a blocked shot's is the blocked shooter.
 *
 * The scheduler writes the columns from the same table, `EVENT_PLAYER_ROLES` in
 * `db/python/event_rules.py`, and a spec holds the two equal.
 */
export const EVENT_PLAYER_ROLES = {
  [EventType.TIP_OFF]: [Role.WINNER, null],
  [EventType.TRAVELING]: [Role.SHOOTER, null],
  [EventType.CARRYING]: [Role.SHOOTER, null],
  [EventType.DOUBLE_DRIBBLE]: [Role.SHOOTER, null],
  [EventType.BAD_PASS]: [Role.SHOOTER, null],
  [EventType.STEAL]: [Role.STEALER, Role.VICTIM],
  [EventType.SHOT_CLOCK_VIOLATION]: [Role.SHOOTER, null],
  [EventType.OFFENSIVE_FOUL]: [Role.FOULER, Role.VICTIM],
  [EventType.QUARTER_END]: [null, null],
  [EventType.BLOCKING_FOUL]: [Role.FOULER, Role.VICTIM],
  [EventType.PUSHING_FOUL]: [Role.FOULER, Role.VICTIM],
  [EventType.REACHING_FOUL]: [Role.FOULER, Role.VICTIM],
  [EventType.CHARGING_FOUL]: [Role.FOULER, Role.VICTIM],
  [EventType.ILLEGAL_SCREEN]: [Role.FOULER, Role.VICTIM],
  [EventType.TECHNICAL_FOUL]: [Role.FOULER, null],
  [EventType.MADE_LAYUP]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MADE_DUNK]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MADE_FADEAWAY]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MADE_PULL_UP_JUMP_SHOT]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MADE_CATCH_AND_SHOOT_THREE]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MADE_STEP_BACK_THREE]: [Role.SHOOTER, Role.ASSISTER],
  [EventType.MISSED_LAYUP]: [Role.SHOOTER, null],
  [EventType.MISSED_DUNK]: [Role.SHOOTER, null],
  [EventType.MISSED_FADEAWAY]: [Role.SHOOTER, null],
  [EventType.MISSED_PULL_UP_JUMP_SHOT]: [Role.SHOOTER, null],
  [EventType.MISSED_CATCH_AND_SHOOT_THREE]: [Role.SHOOTER, null],
  [EventType.MISSED_STEP_BACK_THREE]: [Role.SHOOTER, null],
  [EventType.BLOCKED_SHOT]: [Role.BLOCKED, Role.BLOCKER],
  [EventType.OFFENSIVE_REBOUND]: [Role.REBOUNDER, null],
  [EventType.DEFENSIVE_REBOUND]: [Role.REBOUNDER, null],
  [EventType.FREE_THROW_MADE]: [Role.SHOOTER, null],
  [EventType.FREE_THROW_MISSED]: [Role.SHOOTER, null],
  [EventType.THREE_POINT_SHOOTING_FOUL]: [Role.SHOOTER, Role.FOULER],
  [EventType.TWO_POINT_EXT_SHOOTING_FOUL]: [Role.SHOOTER, Role.FOULER],
  [EventType.TWO_POINT_INT_SHOOTING_FOUL]: [Role.SHOOTER, Role.FOULER],
  [EventType.THREE_POINT_AND_1]: [Role.SHOOTER, Role.FOULER],
  [EventType.TWO_POINT_EXT_AND_1]: [Role.SHOOTER, Role.FOULER],
  [EventType.TWO_POINT_INT_AND_1]: [Role.SHOOTER, Role.FOULER],
  [EventType.INBOUND]: [Role.SHOOTER, null],
  [EventType.SUBSTITUTION]: [Role.EXITING_PLAYER, Role.ENTERING_PLAYER],
} as const satisfies Record<EventType, readonly [Role | null, Role | null]>;
