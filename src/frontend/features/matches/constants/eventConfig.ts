// src/frontend/features/matches/constants/eventConfig.ts
import { EventCategory } from "@/shared/constants/event-categories";

// Event type configurations with icons, colors, and i18n label keys
export const eventConfig: Record<
  string,
  {
    icon: string;
    color: string;
    labelKey: string;
    eventCategory: EventCategory;
  }
> = {
  // Scoring Events
  made_layup: {
    icon: "🏀",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_layup",
    eventCategory: EventCategory.SCORING,
  },
  made_dunk: {
    icon: "💥",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_dunk",
    eventCategory: EventCategory.SCORING,
  },
  made_fadeaway: {
    icon: "🎯",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_fadeaway",
    eventCategory: EventCategory.SCORING,
  },
  made_pull_up_jump_shot: {
    icon: "🎯",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_pull_up_jump_shot",
    eventCategory: EventCategory.SCORING,
  },
  made_catch_and_shoot_three: {
    icon: "🎯",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_catch_and_shoot_three",
    eventCategory: EventCategory.SCORING,
  },
  made_step_back_three: {
    icon: "🎯",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.made_step_back_three",
    eventCategory: EventCategory.SCORING,
  },
  free_throw_made: {
    icon: "✓",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.free_throw_made",
    eventCategory: EventCategory.SCORING,
  },

  // Missed Shots
  missed_layup: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_layup",
    eventCategory: EventCategory.MISS,
  },
  missed_dunk: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_dunk",
    eventCategory: EventCategory.MISS,
  },
  missed_fadeaway: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_fadeaway",
    eventCategory: EventCategory.MISS,
  },
  missed_pull_up_jump_shot: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_pull_up_jump_shot",
    eventCategory: EventCategory.MISS,
  },
  missed_catch_and_shoot_three: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_catch_and_shoot_three",
    eventCategory: EventCategory.MISS,
  },
  missed_step_back_three: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.missed_step_back_three",
    eventCategory: EventCategory.MISS,
  },
  free_throw_missed: {
    icon: "❌",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.free_throw_missed",
    eventCategory: EventCategory.MISS,
  },
  blocked_shot: {
    icon: "🚫",
    color: "text-red-500",
    labelKey: "matchEvents.eventLabels.blocked_shot",
    eventCategory: EventCategory.DEFENSIVE,
  },

  // Fouls
  blocking_foul: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.blocking_foul",
    eventCategory: EventCategory.FOUL,
  },
  pushing_foul: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.pushing_foul",
    eventCategory: EventCategory.FOUL,
  },
  reaching_foul: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.reaching_foul",
    eventCategory: EventCategory.FOUL,
  },
  charging_foul: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.charging_foul",
    eventCategory: EventCategory.FOUL,
  },
  illegal_screen: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.illegal_screen",
    eventCategory: EventCategory.FOUL,
  },
  technical_foul: {
    icon: "⚠️",
    color: "text-orange-600",
    labelKey: "matchEvents.eventLabels.technical_foul",
    eventCategory: EventCategory.FOUL,
  },
  offensive_foul: {
    icon: "⚠️",
    color: "text-yellow-600",
    labelKey: "matchEvents.eventLabels.offensive_foul",
    eventCategory: EventCategory.FOUL,
  },

  // Shooting Fouls
  "3_point_shooting_foul": {
    icon: "🔔",
    color: "text-blue-600",
    labelKey: "matchEvents.eventLabels.three_point_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "2_point_ext_shooting_foul": {
    icon: "🔔",
    color: "text-blue-600",
    labelKey: "matchEvents.eventLabels.two_point_ext_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "2_point_int_shooting_foul": {
    icon: "🔔",
    color: "text-blue-600",
    labelKey: "matchEvents.eventLabels.two_point_int_shooting_foul",
    eventCategory: EventCategory.FOUL,
  },
  "3_point_and_1": {
    icon: "🎊",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.three_point_and_one",
    eventCategory: EventCategory.SCORING,
  },
  "2_point_ext_and_1": {
    icon: "🎊",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.two_point_ext_and_one",
    eventCategory: EventCategory.SCORING,
  },
  "2_point_int_and_1": {
    icon: "🎊",
    color: "text-green-600",
    labelKey: "matchEvents.eventLabels.two_point_int_and_one",
    eventCategory: EventCategory.SCORING,
  },

  // Turnovers
  traveling: {
    icon: "🚶",
    color: "text-orange-500",
    labelKey: "matchEvents.eventLabels.traveling",
    eventCategory: EventCategory.TURNOVER,
  },
  carrying: {
    icon: "✋",
    color: "text-orange-500",
    labelKey: "matchEvents.eventLabels.carrying",
    eventCategory: EventCategory.TURNOVER,
  },
  double_dribble: {
    icon: "✋",
    color: "text-orange-500",
    labelKey: "matchEvents.eventLabels.double_dribble",
    eventCategory: EventCategory.TURNOVER,
  },
  bad_pass: {
    icon: "📤",
    color: "text-orange-500",
    labelKey: "matchEvents.eventLabels.bad_pass",
    eventCategory: EventCategory.TURNOVER,
  },
  steal: {
    icon: "🤚",
    color: "text-blue-500",
    labelKey: "matchEvents.eventLabels.steal",
    eventCategory: EventCategory.DEFENSIVE,
  },
  shot_clock_violation: {
    icon: "⏱️",
    color: "text-orange-500",
    labelKey: "matchEvents.eventLabels.shot_clock_violation",
    eventCategory: EventCategory.TURNOVER,
  },

  // Rebounds
  offensive_rebound: {
    icon: "↗️",
    color: "text-purple-600",
    labelKey: "matchEvents.eventLabels.offensive_rebound",
    eventCategory: EventCategory.REBOUND,
  },
  defensive_rebound: {
    icon: "↘️",
    color: "text-purple-600",
    labelKey: "matchEvents.eventLabels.defensive_rebound",
    eventCategory: EventCategory.REBOUND,
  },

  // Game Events
  tip_off: {
    icon: "🏁",
    color: "text-gray-600",
    labelKey: "matchEvents.eventLabels.tip_off",
    eventCategory: EventCategory.GAME,
  },
  quarter_end: {
    icon: "⏸️",
    color: "text-gray-600",
    labelKey: "matchEvents.eventLabels.quarter_end",
    eventCategory: EventCategory.GAME,
  },
  inbound: {
    icon: "📥",
    color: "text-gray-500",
    labelKey: "matchEvents.eventLabels.inbound",
    eventCategory: EventCategory.GAME,
  },

  // Substitution
  substitution: {
    icon: "⇄",
    color: "text-blue-600",
    labelKey: "matchEvents.eventLabels.substitution",
    eventCategory: EventCategory.SUBSTITUTION,
  },
};
