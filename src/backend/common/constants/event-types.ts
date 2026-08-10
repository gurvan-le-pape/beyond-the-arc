// src/backend/common/constants/event-types.ts

/**
 * Match event types. Must stay in sync with the check_event_type CHECK
 * constraint in prisma/migrations/0_init/migration.sql — the database is
 * the source of truth for the allowed values.
 */
export const EventType = {
  TIP_OFF: "tip_off",
  TRAVELING: "traveling",
  CARRYING: "carrying",
  DOUBLE_DRIBBLE: "double_dribble",
  BAD_PASS: "bad_pass",
  STEAL: "steal",
  SHOT_CLOCK_VIOLATION: "shot_clock_violation",
  OFFENSIVE_FOUL: "offensive_foul",
  QUARTER_END: "quarter_end",
  BLOCKING_FOUL: "blocking_foul",
  PUSHING_FOUL: "pushing_foul",
  REACHING_FOUL: "reaching_foul",
  CHARGING_FOUL: "charging_foul",
  ILLEGAL_SCREEN: "illegal_screen",
  TECHNICAL_FOUL: "technical_foul",
  MADE_LAYUP: "made_layup",
  MADE_DUNK: "made_dunk",
  MADE_FADEAWAY: "made_fadeaway",
  MADE_PULL_UP_JUMP_SHOT: "made_pull_up_jump_shot",
  MADE_CATCH_AND_SHOOT_THREE: "made_catch_and_shoot_three",
  MADE_STEP_BACK_THREE: "made_step_back_three",
  MISSED_LAYUP: "missed_layup",
  MISSED_DUNK: "missed_dunk",
  MISSED_FADEAWAY: "missed_fadeaway",
  MISSED_PULL_UP_JUMP_SHOT: "missed_pull_up_jump_shot",
  MISSED_CATCH_AND_SHOOT_THREE: "missed_catch_and_shoot_three",
  MISSED_STEP_BACK_THREE: "missed_step_back_three",
  BLOCKED_SHOT: "blocked_shot",
  OFFENSIVE_REBOUND: "offensive_rebound",
  DEFENSIVE_REBOUND: "defensive_rebound",
  FREE_THROW_MADE: "free_throw_made",
  FREE_THROW_MISSED: "free_throw_missed",
  THREE_POINT_SHOOTING_FOUL: "3_point_shooting_foul",
  TWO_POINT_EXT_SHOOTING_FOUL: "2_point_ext_shooting_foul",
  TWO_POINT_INT_SHOOTING_FOUL: "2_point_int_shooting_foul",
  THREE_POINT_AND_1: "3_point_and_1",
  TWO_POINT_EXT_AND_1: "2_point_ext_and_1",
  TWO_POINT_INT_AND_1: "2_point_int_and_1",
  INBOUND: "inbound",
  SUBSTITUTION: "substitution",
} as const;

export const EVENT_TYPE_LIST = Object.values(EventType);
export type EventType = (typeof EVENT_TYPE_LIST)[number];
