"""
Every event the simulator emits names its players by the roles
EVENT_PLAYER_ROLES gives its type, so both fit the two player columns of
`match_events` and none is dropped on the way in.
"""

import random
from datetime import datetime, timezone

import pytest

from event_rules import EVENT_PLAYER_ROLES
from tests.season_sample import ROSTER_SIZE, build_generator, roster

STARTS_AT = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
HOME, AWAY = roster(100), roster(100 + ROSTER_SIZE)


@pytest.fixture(scope="module")
def events():
    random.seed(7)
    generator = build_generator()
    return [event for _ in range(60) for event in generator.simulate(HOME, AWAY, STARTS_AT).events]


@pytest.fixture
def match_repository(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://unused")
    from db.repositories import match_repository as module

    return module


def test_the_table_covers_the_forty_event_types():
    assert len(EVENT_PLAYER_ROLES) == 40


def test_every_emitted_type_is_in_the_table(events):
    assert {event["event_type"] for event in events} <= set(EVENT_PLAYER_ROLES)


def test_an_event_names_only_its_types_roles_and_always_its_main_player(events):
    for event in events:
        main, other = EVENT_PLAYER_ROLES[event["event_type"]]
        roles = event["player_roles"]
        assert set(roles) <= {main, other} - {None}, event
        if main is not None:
            assert roles[main] is not None, event


def test_the_writer_puts_main_and_other_in_their_columns(match_repository):
    block = {"event_type": "blocked_shot", "player_roles": {"blocker": 9, "blocked": 4}}
    assert match_repository.event_players(block) == (4, 9)
    assert match_repository.event_players({"event_type": "quarter_end", "player_roles": {}}) == (None, None)
    assert match_repository.event_players({"event_type": "made_dunk", "player_roles": {"shooter": 3}}) == (3, None)


def test_the_writer_rejects_a_role_the_table_does_not_name(match_repository):
    with pytest.raises(ValueError, match="starter"):
        match_repository.event_players({"event_type": "tip_off", "player_roles": {"winner": 1, "starter": [1, 2]}})
