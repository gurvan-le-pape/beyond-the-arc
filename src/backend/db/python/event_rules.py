"""
Shared match-event scoring/stat rules — single source of truth for "what does
this event type mean", used by both MatchSimulator (live score) and
MatchGenerator._compute_player_stats (persisted per-player stats). Keeping
these in one place avoids the two having to be updated in lockstep whenever a
shot/foul event type is added or changed.
"""

# Made-shot event types -> (shot category, points scored).
# Category matches the three_points_*/two_points_int_*/two_points_ext_*
# stat column prefixes via SHOT_CATEGORY_STAT_PREFIX below.
MADE_SHOTS = {
    "made_catch_and_shoot_three": ("three", 3),
    "made_step_back_three": ("three", 3),
    "3_point_and_1": ("three", 3),
    "made_layup": ("two_int", 2),
    "made_dunk": ("two_int", 2),
    "2_point_int_and_1": ("two_int", 2),
    "made_fadeaway": ("two_ext", 2),
    "made_pull_up_jump_shot": ("two_ext", 2),
    "2_point_ext_and_1": ("two_ext", 2),
}

# Missed-shot event types -> shot category (no points, still counts as an attempt).
MISSED_SHOTS = {
    "missed_catch_and_shoot_three": "three",
    "missed_step_back_three": "three",
    "missed_layup": "two_int",
    "missed_dunk": "two_int",
    "missed_fadeaway": "two_ext",
    "missed_pull_up_jump_shot": "two_ext",
}

SHOT_CATEGORY_STAT_PREFIX = {
    "three": "three_points",
    "two_int": "two_points_int",
    "two_ext": "two_points_ext",
}

# Pure shooting-foul event types -> number of free throws awarded.
SHOOTING_FOUL_FREE_THROWS = {
    "3_point_shooting_foul": 3,
    "2_point_ext_shooting_foul": 2,
    "2_point_int_shooting_foul": 2,
}

# "And-1" event types (made shot + shooting foul) -> number of free throws awarded.
AND_ONE_FREE_THROWS = {
    "3_point_and_1": 1,
    "2_point_ext_and_1": 1,
    "2_point_int_and_1": 1,
}
