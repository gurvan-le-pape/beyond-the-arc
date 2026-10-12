"""Foul and turnover attribution, one event at a time."""

from generation.match_generator import STAT_COLUMNS, compute_player_stats
from simulation.event_generator import EventGenerator

ATTACKER = 1
DEFENDER = 2
PLAYTIMES = {ATTACKER: [(0, 2400)]}, {DEFENDER: [(0, 2400)]}


def column_by_player(column: str, *events: dict) -> dict[int, int]:
    rows = compute_player_stats(*PLAYTIMES, list(events))
    index = 1 + STAT_COLUMNS.index(column)  # the row starts with the player id
    return {row[0]: row[index] for row in rows}


def turnovers_by_player(*events: dict) -> dict[int, int]:
    return column_by_player("turnovers", *events)


def generate(event_type: str) -> dict:
    return EventGenerator(state_manager=None).generate_event(
        {"type": event_type}, [ATTACKER], [DEFENDER], "home", {}
    )


def test_a_steal_is_the_victims_turnover():
    steal = {"event_type": "steal", "player_roles": {"stealer": DEFENDER, "victim": ATTACKER}}

    assert turnovers_by_player(steal) == {ATTACKER: 1, DEFENDER: 0}


def test_being_fouled_is_not_a_turnover():
    for foul in ("blocking_foul", "pushing_foul", "reaching_foul"):
        event = {"event_type": foul, "player_roles": {"fouler": DEFENDER, "victim": ATTACKER}}

        assert turnovers_by_player(event) == {ATTACKER: 0, DEFENDER: 0}, foul


def test_a_violation_is_the_ball_handlers_turnover():
    for violation in ("traveling", "bad_pass", "shot_clock_violation"):
        event = {"event_type": violation, "player_roles": {"shooter": ATTACKER}}

        assert turnovers_by_player(event) == {ATTACKER: 1}, violation


def test_the_end_of_a_quarter_involves_no_player():
    event = generate("quarter_end")

    assert event["player_roles"] == {}
    assert turnovers_by_player(event) == {}


def test_an_offensive_foul_is_committed_by_an_attacker():
    for foul in ("offensive_foul", "charging_foul", "illegal_screen"):
        event = generate(foul)

        assert event["player_roles"] == {"fouler": ATTACKER, "victim": DEFENDER}, foul
        assert column_by_player("fouls", event) == {ATTACKER: 1, DEFENDER: 0}, foul
        assert turnovers_by_player(event) == {ATTACKER: 1, DEFENDER: 0}, foul


def test_a_defensive_foul_is_committed_by_a_defender():
    for foul in ("blocking_foul", "pushing_foul", "reaching_foul"):
        event = generate(foul)

        assert event["player_roles"] == {"fouler": DEFENDER, "victim": ATTACKER}, foul
        assert column_by_player("fouls", event) == {ATTACKER: 0, DEFENDER: 1}, foul
