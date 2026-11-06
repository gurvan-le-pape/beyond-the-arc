"""
Every simulated match starts from a possession.

A worker process keeps one MatchSimulator for all the matches it plays, so
nothing about the match before may decide how the next one opens.
"""

import random
from datetime import datetime, timezone

import pytest

from tests.season_sample import ROSTER_SIZE, build_generator, roster

STARTS_AT = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)


# Not `shot_attempt`: a shot is a legal first play, so its opening looks the same.
@pytest.mark.parametrize("left_over_state", ["rebound", "dead_ball"])
def test_a_match_ignores_the_state_the_last_one_ended_in(left_over_state):
    random.seed(5)
    generator = build_generator()

    for _ in range(20):
        generator.simulator.state_manager.current_state = left_over_state
        match = generator.simulate(roster(100), roster(100 + ROSTER_SIZE), STARTS_AT)

        first_play = next(
            e["event_type"] for e in match.events
            if e["event_type"] not in ("tip_off", "substitution")
        )
        # From a possession the first thing to happen is a shot or a dead ball.
        # Only a left-over state can open on a rebound, an inbound or a free throw.
        assert first_play not in (
            "offensive_rebound", "defensive_rebound", "inbound", "free_throw_made", "free_throw_missed",
        )
