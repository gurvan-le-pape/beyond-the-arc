"""
Quarter boundaries in simulated matches.

The frontend splits a match into quarters by elapsed time, so the
`quarter_end` events must sit exactly on the buzzers and nowhere else.
"""

import random
from datetime import datetime, timedelta, timezone

import pytest

from simulation.match_simulator import QUARTER_LENGTH, QUARTERS
from tests.season_sample import ROSTER_SIZE, build_generator, roster

STARTS_AT = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
BUZZERS = [STARTS_AT + timedelta(seconds=QUARTER_LENGTH * q) for q in range(1, QUARTERS + 1)]


@pytest.fixture(scope="module")
def matches():
    random.seed(3)
    generator = build_generator()
    return [
        generator.simulate(roster(i * 100), roster(i * 100 + ROSTER_SIZE), STARTS_AT)
        for i in range(20)
    ]


def test_every_quarter_ends_on_its_buzzer(matches):
    for match in matches:
        ends = [e["occurred_at"] for e in match.events if e["event_type"] == "quarter_end"]

        assert ends == BUZZERS


def test_no_play_runs_past_a_buzzer_into_the_break(matches):
    for match in matches:
        for buzzer in BUZZERS[:-1]:
            in_break = [
                e for e in match.events
                if buzzer < e["occurred_at"] < buzzer + timedelta(seconds=1)
            ]

            assert in_break == []
