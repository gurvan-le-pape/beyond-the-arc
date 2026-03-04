// src/frontend/features/matches/constants/eventCategories.ts
// Event category mapping for filtering match events
export const eventCategories: Record<string, string[]> = {
  scoring: [
    "made_layup",
    "made_dunk",
    "made_fadeaway",
    "made_pull_up_jump_shot",
    "made_catch_and_shoot_three",
    "made_step_back_three",
    "free_throw_made",
    "3_point_and_1",
    "2_point_ext_and_1",
    "2_point_int_and_1",
  ],
  defensive: [
    "blocked_shot",
    "steal",
    "offensive_rebound",
    "defensive_rebound",
  ],
  fouls: [
    "blocking_foul",
    "pushing_foul",
    "reaching_foul",
    "charging_foul",
    "illegal_screen",
    "technical_foul",
    "offensive_foul",
    "3_point_shooting_foul",
    "2_point_ext_shooting_foul",
    "2_point_int_shooting_foul",
  ],
  turnovers: [
    "traveling",
    "carrying",
    "double_dribble",
    "bad_pass",
    "shot_clock_violation",
  ],
  substitutions: ["substitution"],
};
