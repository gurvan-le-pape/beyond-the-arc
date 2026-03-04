// src/frontend/shared/constants/event-types.ts
export const EventType = {
  // Game Start Event
  TIP_OFF: "tip_off",
  // Turnover Events
  TRAVELING: "traveling",
  CARRYING: "carrying",
  DOUBLE_DRIBBLE: "double_dribble",
  BAD_PASS: "bad_pass",
  STEAL: "steal",
  SHOT_CLOCK_VIOLATION: "shot_clock_violation",
  OFFENSIVE_FOUL: "offensive_foul",
  QUARTER_END: "quarter_end",
  // Foul Events
  BLOCKING_FOUL: "blocking_foul",
  PUSHING_FOUL: "pushing_foul",
  REACHING_FOUL: "reaching_foul",
  CHARGING_FOUL: "charging_foul",
  ILLEGAL_SCREEN: "illegal_screen",
  TECHNICAL_FOUL: "technical_foul",
  // Shot Attempt Events
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
  // Rebound Events
  OFFENSIVE_REBOUND: "offensive_rebound",
  DEFENSIVE_REBOUND: "defensive_rebound",
  // Free Throw Events
  FREE_THROW_MADE: "free_throw_made",
  FREE_THROW_MISSED: "free_throw_missed",
  // Shooting Foul Events
  THREE_POINT_SHOOTING_FOUL: "3_point_shooting_foul",
  TWO_POINT_EXT_SHOOTING_FOUL: "2_point_ext_shooting_foul",
  TWO_POINT_INT_SHOOTING_FOUL: "2_point_int_shooting_foul",
  THREE_POINT_AND_1: "3_point_and_1",
  TWO_POINT_EXT_AND_1: "2_point_ext_and_1",
  TWO_POINT_INT_AND_1: "2_point_int_and_1",
  // Transition Events
  INBOUND: "inbound",
  // Substitution Events
  SUBSTITUTION: "substitution",
} as const;

export const EVENT_TYPE_LIST = Object.values(EventType);
export type EventType = (typeof EVENT_TYPE_LIST)[number];
