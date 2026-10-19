"""
Periods in simulated matches: four quarters, then overtime until someone leads.

The frontend splits a match into periods by elapsed time, so the
`quarter_end` events must sit exactly on the buzzers and nowhere else.
"""

import json
import random
from datetime import datetime, timedelta, timezone

import pytest

from generation.playtime_generator import ON_COURT
from simulation.match_simulator import GAME_DURATION, OVERTIME_LENGTH, QUARTER_LENGTH, QUARTERS
from tests.season_sample import ROSTER_SIZE, build_generator, roster

STARTS_AT = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
REGULATION_BUZZERS = [STARTS_AT + timedelta(seconds=QUARTER_LENGTH * q) for q in range(1, QUARTERS + 1)]


@pytest.fixture(scope="module")
def matches():
    random.seed(3)
    generator = build_generator()
    return [
        (generator.simulate(roster(i * 100), roster(i * 100 + ROSTER_SIZE), STARTS_AT), i * 100)
        for i in range(150)
    ]


def buzzers(match):
    return [e["occurred_at"] for e in match.events if e["event_type"] == "quarter_end"]


def test_the_sample_contains_overtime(matches):
    assert any(match.overtime for match, _ in matches)


def test_every_period_ends_on_its_buzzer(matches):
    for match, _ in matches:
        ends = buzzers(match)
        overtimes = [REGULATION_BUZZERS[-1] + timedelta(seconds=OVERTIME_LENGTH * n)
                     for n in range(1, len(ends) - QUARTERS + 1)]

        assert ends == REGULATION_BUZZERS + overtimes
        assert match.overtime == (len(ends) > QUARTERS)


def test_no_play_runs_past_a_buzzer_into_the_break(matches):
    for match, _ in matches:
        for buzzer in buzzers(match)[:-1]:
            in_break = [
                e for e in match.events
                if buzzer < e["occurred_at"] < buzzer + timedelta(seconds=1)
            ]

            assert in_break == []


def test_no_match_ends_level(matches):
    for match, _ in matches:
        assert match.home_score != match.away_score


def test_each_side_fields_five_for_the_whole_game(matches):
    for match, home_first_id in matches:
        length = (buzzers(match)[-1] - STARTS_AT).total_seconds()
        home_ids = range(home_first_id, home_first_id + ROSTER_SIZE)
        on_court = {"home": 0, "away": 0}
        for row in match.stat_rows:
            side = "home" if row[0] in home_ids else "away"
            on_court[side] += sum(end - start for start, end in json.loads(row[-1]))

        assert on_court == {"home": ON_COURT * length, "away": ON_COURT * length}
        assert length >= GAME_DURATION
