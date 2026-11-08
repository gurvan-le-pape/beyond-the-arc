"""
Shared match-event scoring/stat rules — single source of truth for "what does
this event type mean", used by both MatchSimulator (live score) and
compute_box_score in generation/match_generator.py (the persisted box score). Keeping
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

# Shooting-foul event types -> category of the shot the foul interrupted.
SHOOTING_FOUL_CATEGORY = {
    "3_point_shooting_foul": "three",
    "2_point_ext_shooting_foul": "two_ext",
    "2_point_int_shooting_foul": "two_int",
}

# "And-1" event types (made shot + shooting foul) -> number of free throws awarded.
AND_ONE_FREE_THROWS = {
    "3_point_and_1": 1,
    "2_point_ext_and_1": 1,
    "2_point_int_and_1": 1,
}

# Turnovers charged to the event's ball handler (its `shooter` role). A steal is
# charged to its `victim`, an offensive foul to its `fouler` (see
# OFFENSIVE_FOULS), and `quarter_end` is nobody's turnover.
BALL_HANDLER_TURNOVERS = {
    "traveling",
    "carrying",
    "double_dribble",
    "bad_pass",
    "shot_clock_violation",
}

# Fouls committed by the offence. Each is both a foul and a turnover for its
# `fouler`, an attacker; its `victim` is the defender who drew it.
OFFENSIVE_FOULS = {
    "offensive_foul",
    "charging_foul",
    "illegal_screen",
}

# A blocked shot's category, drawn with these weights: most blocks are on
# shots at the rim, few on jump shots.
BLOCKED_SHOT_CATEGORY_WEIGHTS = {
    "two_int": 0.7,
    "two_ext": 0.2,
    "three": 0.1,
}

# The players an event names: (main, other), by role. An event stores its main
# player in `match_events.player_id` and the other in `other_player_id`; a None
# role is never set. The main player of a shot is the one who took it, so a
# blocked shot's is the blocked shooter. The backend reads these columns through
# the same table, in `common/constants/event-player-roles.ts`.
EVENT_PLAYER_ROLES = {
    "tip_off": ("winner", None),
    "traveling": ("shooter", None),
    "carrying": ("shooter", None),
    "double_dribble": ("shooter", None),
    "bad_pass": ("shooter", None),
    "steal": ("stealer", "victim"),
    "shot_clock_violation": ("shooter", None),
    "offensive_foul": ("fouler", "victim"),
    "quarter_end": (None, None),
    "blocking_foul": ("fouler", "victim"),
    "pushing_foul": ("fouler", "victim"),
    "reaching_foul": ("fouler", "victim"),
    "charging_foul": ("fouler", "victim"),
    "illegal_screen": ("fouler", "victim"),
    "technical_foul": ("fouler", None),
    "made_layup": ("shooter", "assister"),
    "made_dunk": ("shooter", "assister"),
    "made_fadeaway": ("shooter", "assister"),
    "made_pull_up_jump_shot": ("shooter", "assister"),
    "made_catch_and_shoot_three": ("shooter", "assister"),
    "made_step_back_three": ("shooter", "assister"),
    "missed_layup": ("shooter", None),
    "missed_dunk": ("shooter", None),
    "missed_fadeaway": ("shooter", None),
    "missed_pull_up_jump_shot": ("shooter", None),
    "missed_catch_and_shoot_three": ("shooter", None),
    "missed_step_back_three": ("shooter", None),
    "blocked_shot": ("blocked", "blocker"),
    "offensive_rebound": ("rebounder", None),
    "defensive_rebound": ("rebounder", None),
    "free_throw_made": ("shooter", None),
    "free_throw_missed": ("shooter", None),
    "3_point_shooting_foul": ("shooter", "fouler"),
    "2_point_ext_shooting_foul": ("shooter", "fouler"),
    "2_point_int_shooting_foul": ("shooter", "fouler"),
    "3_point_and_1": ("shooter", "fouler"),
    "2_point_ext_and_1": ("shooter", "fouler"),
    "2_point_int_and_1": ("shooter", "fouler"),
    "inbound": ("shooter", None),
    "substitution": ("exiting_player", "entering_player"),
}
