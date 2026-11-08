"""Every shot is placed on the court, in the zone of its category."""

import math

import pytest

from event_rules import MADE_SHOTS, MISSED_SHOTS, SHOT_CATEGORY_STAT_PREFIX
from generation.match_generator import STAT_COLUMNS, compute_box_score
from simulation.event_generator import EventGenerator
from tests.season_sample import build_generator, roster

RIM = (7.5, 1.575)
THREE_POINT_RADIUS = 6.75
SHOT_EVENTS = set(MADE_SHOTS) | set(MISSED_SHOTS) | {"blocked_shot"}


def distance_from_rim(location: dict) -> float:
    return math.hypot(location["x"] - RIM[0], location["y"] - RIM[1])


@pytest.fixture(scope="module")
def sample_events():
    import random
    from datetime import datetime, timezone

    random.seed(11)
    generator = build_generator()
    starts_at = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
    events = []
    for index in range(50):
        result = generator.simulate(roster(index * 100), roster(index * 100 + 12), starts_at)
        events.extend(result.events)
    return events


def test_every_shot_has_a_location(sample_events):
    shots = [e for e in sample_events if e["event_type"] in SHOT_EVENTS]
    unplaced = {e["event_type"] for e in shots if not e.get("shot_location")}

    assert shots
    assert unplaced == set()


@pytest.mark.parametrize("event_type", ["3_point_and_1", "2_point_ext_and_1", "2_point_int_and_1"])
def test_an_and_one_is_placed_in_its_own_zone(event_type):
    category = MADE_SHOTS[event_type][0]
    for _ in range(50):
        event = EventGenerator(state_manager=None).generate_event(
            {"type": event_type}, [1], [2], "home"
        )
        distance = distance_from_rim(event["shot_location"])

        if category == "three":
            assert distance >= THREE_POINT_RADIUS
        else:
            assert distance < THREE_POINT_RADIUS


def test_a_blocked_shot_counts_as_an_attempt_in_its_category():
    for category, prefix in SHOT_CATEGORY_STAT_PREFIX.items():
        blocked = {
            "event_type": "blocked_shot",
            "player_roles": {"blocked": 1, "blocker": 2},
            "shot_category": category,
        }
        shooter = compute_box_score({1: [(0, 2400)]}, {2: [(0, 2400)]}, [blocked])["1"]
        attempts = {column: shooter[column] for column in STAT_COLUMNS if column.endswith("_attempted")}

        assert attempts[f"{prefix}_attempted"] == 1, category
        assert sum(attempts.values()) == 1, category
