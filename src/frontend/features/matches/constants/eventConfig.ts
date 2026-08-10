// src/frontend/features/matches/constants/eventConfig.ts
import { EventCategory } from "@/shared/constants";

// Event type configurations: icon, i18n label key, and category.
// Colour is NOT here — it is a property of the category, resolved through
// EVENT_CATEGORY_COLOR in eventColors.ts.
export const eventConfig = {
  // Scoring Events
  made_layup: {
    icon: "🏀",
    labelKey: "matchEvents.eventLabels.made_layup",
    eventCategory: EventCategory.MADE,
  },
  made_dunk: {
    icon: "💥",
    labelKey: "matchEvents.eventLabels.made_dunk",
    eventCategory: EventCategory.MADE,
  },
  made_fadeaway: {
    icon: "🎯",
    labelKey: "matchEvents.eventLabels.made_fadeaway",
    eventCategory: EventCategory.MADE,
  },
  made_pull_up_jump_shot: {
    icon: "🎯",
    labelKey: "matchEvents.eventLabels.made_pull_up_jump_shot",
    eventCategory: EventCategory.MADE,
  },
  made_catch_and_shoot_three: {
    icon: "🎯",
    labelKey: "matchEvents.eventLabels.made_catch_and_shoot_three",
    eventCategory: EventCategory.MADE,
  },
  made_step_back_three: {
    icon: "🎯",
    labelKey: "matchEvents.eventLabels.made_step_back_three",
    eventCategory: EventCategory.MADE,
  },
  free_throw_made: {
    icon: "✓",
    labelKey: "matchEvents.eventLabels.free_throw_made",
    eventCategory: EventCategory.MADE,
  },

  // Missed Shots
  missed_layup: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_layup",
    eventCategory: EventCategory.MISS,
  },
  missed_dunk: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_dunk",
    eventCategory: EventCategory.MISS,
  },
  missed_fadeaway: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_fadeaway",
    eventCategory: EventCategory.MISS,
  },
  missed_pull_up_jump_shot: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_pull_up_jump_shot",
    eventCategory: EventCategory.MISS,
  },
  missed_catch_and_shoot_three: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_catch_and_shoot_three",
    eventCategory: EventCategory.MISS,
  },
  missed_step_back_three: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.missed_step_back_three",
    eventCategory: EventCategory.MISS,
  },
  free_throw_missed: {
    icon: "❌",
    labelKey: "matchEvents.eventLabels.free_throw_missed",
    eventCategory: EventCategory.MISS,
  },
  blocked_shot: {
    icon: "🚫",
    labelKey: "matchEvents.eventLabels.blocked_shot",
    eventCategory: EventCategory.DEFENSIVE,
  },

  // Fouls
  blocking_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.blocking_foul",
    eventCategory: EventCategory.FOUL,
  },
  pushing_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.pushing_foul",
    eventCategory: EventCategory.FOUL,
  },
  reaching_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.reaching_foul",
    eventCategory: EventCategory.FOUL,
  },
  charging_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.charging_foul",
    eventCategory: EventCategory.FOUL,
  },
  illegal_screen: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.illegal_screen",
    eventCategory: EventCategory.FOUL,
  },
  technical_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.technical_foul",
    eventCategory: EventCategory.FOUL,
  },
  offensive_foul: {
    icon: "⚠️",
    labelKey: "matchEvents.eventLabels.offensive_foul",
    eventCategory: EventCategory.FOUL,
  },

  // Shooting Fouls
  "3_point_shooting_foul": {
    icon: "🔔",
    labelKey: "matchEvents.eventLabels.three_point_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "2_point_ext_shooting_foul": {
    icon: "🔔",
    labelKey: "matchEvents.eventLabels.two_point_ext_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "2_point_int_shooting_foul": {
    icon: "🔔",
    labelKey: "matchEvents.eventLabels.two_point_int_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "3_point_and_1": {
    icon: "🎊",
    labelKey: "matchEvents.eventLabels.three_point_and_one",
    eventCategory: EventCategory.MADE,
  },
  "2_point_ext_and_1": {
    icon: "🎊",
    labelKey: "matchEvents.eventLabels.two_point_ext_and_one",
    eventCategory: EventCategory.MADE,
  },
  "2_point_int_and_1": {
    icon: "🎊",
    labelKey: "matchEvents.eventLabels.two_point_int_and_one",
    eventCategory: EventCategory.MADE,
  },

  // Turnovers
  traveling: {
    icon: "🚶",
    labelKey: "matchEvents.eventLabels.traveling",
    eventCategory: EventCategory.TURNOVER,
  },
  carrying: {
    icon: "✋",
    labelKey: "matchEvents.eventLabels.carrying",
    eventCategory: EventCategory.TURNOVER,
  },
  double_dribble: {
    icon: "✋",
    labelKey: "matchEvents.eventLabels.double_dribble",
    eventCategory: EventCategory.TURNOVER,
  },
  bad_pass: {
    icon: "📤",
    labelKey: "matchEvents.eventLabels.bad_pass",
    eventCategory: EventCategory.TURNOVER,
  },
  steal: {
    icon: "🤚",
    labelKey: "matchEvents.eventLabels.steal",
    eventCategory: EventCategory.DEFENSIVE,
  },
  shot_clock_violation: {
    icon: "⏱️",
    labelKey: "matchEvents.eventLabels.shot_clock_violation",
    eventCategory: EventCategory.TURNOVER,
  },

  // Rebounds
  offensive_rebound: {
    icon: "↗️",
    labelKey: "matchEvents.eventLabels.offensive_rebound",
    eventCategory: EventCategory.REBOUND,
  },
  defensive_rebound: {
    icon: "↘️",
    labelKey: "matchEvents.eventLabels.defensive_rebound",
    eventCategory: EventCategory.REBOUND,
  },

  // Game Events
  tip_off: {
    icon: "🏁",
    labelKey: "matchEvents.eventLabels.tip_off",
    eventCategory: EventCategory.GAME,
  },
  quarter_end: {
    icon: "⏸️",
    labelKey: "matchEvents.eventLabels.quarter_end",
    eventCategory: EventCategory.GAME,
  },
  inbound: {
    icon: "📥",
    labelKey: "matchEvents.eventLabels.inbound",
    eventCategory: EventCategory.GAME,
  },

  // Substitution
  substitution: {
    icon: "⇄",
    labelKey: "matchEvents.eventLabels.substitution",
    eventCategory: EventCategory.SUBSTITUTION,
  },
} as const satisfies Record<
  string,
  {
    icon: string;
    labelKey: string;
    eventCategory: EventCategory;
  }
>;
