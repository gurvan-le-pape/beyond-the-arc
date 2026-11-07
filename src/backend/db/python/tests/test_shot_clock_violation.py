"""
A shot clock violation means the clock ran out, and it plays like any other
violation: a named player, a dead ball, then an inbound for the other team.
"""

import random
from datetime import datetime, timezone

import pytest

from tests.season_sample import ROSTER_SIZE, build_generator, roster

STARTS_AT = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
HOME, AWAY = roster(100), roster(100 + ROSTER_SIZE)


@pytest.fixture(scope="module")
def clocks_and_matches():
    """The shot clock at each violation, and the matches they were played in."""
    random.seed(11)
    generator = build_generator()
    clocks = []
    apply_event = generator.simulator._apply_event

    def record_clock(match, event, next_state):
        if event["event_type"] == "shot_clock_violation":
            clocks.append(match.shot_clock)
        return apply_event(match, event, next_state)

    generator.simulator._apply_event = record_clock
    return clocks, [generator.simulate(HOME, AWAY, STARTS_AT) for _ in range(100)]


def violations(matches):
    for match in matches:
        for index, event in enumerate(match.events):
            if event["event_type"] == "shot_clock_violation":
                yield event, match.events[index + 1 :]


def test_a_violation_only_happens_when_the_clock_has_run_out(clocks_and_matches):
    clocks, _ = clocks_and_matches
    assert clocks
    assert set(clocks) == {0}


def test_a_violation_names_the_player_who_committed_it(clocks_and_matches):
    _, matches = clocks_and_matches
    names = {name for _, name, _ in HOME + AWAY}
    for event, _ in violations(matches):
        assert event["description"].removesuffix(" committed a shot clock violation.") in names


def test_play_restarts_from_an_inbound_unless_the_period_ended(clocks_and_matches):
    _, matches = clocks_and_matches
    for _, following in violations(matches):
        restart = next((e for e in following if e["event_type"] != "substitution"), None)
        if restart is not None:
            assert restart["event_type"] in ("inbound", "quarter_end")
