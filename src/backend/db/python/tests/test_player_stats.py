"""Turnover attribution, one event at a time."""

from generation.match_generator import STAT_COLUMNS, compute_player_stats
from simulation.event_generator import EventGenerator

ATTACKER = 1
DEFENDER = 2
PLAYTIMES = {ATTACKER: [(0, 2400)]}, {DEFENDER: [(0, 2400)]}


def turnovers_by_player(*events: dict) -> dict[int, int]:
    rows = compute_player_stats(*PLAYTIMES, list(events))
    index = 1 + STAT_COLUMNS.index("turnovers")  # the row starts with the player id
    return {row[0]: row[index] for row in rows}


def test_a_steal_is_the_victims_turnover():
    steal = {"event_type": "steal", "player_roles": {"stealer": DEFENDER, "victim": ATTACKER}}

    assert turnovers_by_player(steal) == {ATTACKER: 1, DEFENDER: 0}


def test_being_fouled_is_not_a_turnover():
    for foul in ("blocking_foul", "pushing_foul", "reaching_foul"):
        event = {"event_type": foul, "player_roles": {"fouler": DEFENDER, "victim": ATTACKER}}

        assert turnovers_by_player(event) == {ATTACKER: 0, DEFENDER: 0}, foul


def test_a_violation_is_the_ball_handlers_turnover():
    for violation in ("traveling", "bad_pass", "shot_clock_violation", "offensive_foul"):
        event = {"event_type": violation, "player_roles": {"shooter": ATTACKER}}

        assert turnovers_by_player(event) == {ATTACKER: 1}, violation


def test_the_end_of_a_quarter_involves_no_player():
    generator = EventGenerator(state_manager=None)

    event = generator.generate_event(
        {"type": "quarter_end"}, [ATTACKER], [DEFENDER], "home", {}
    )

    assert event["player_roles"] == {}
    assert turnovers_by_player(event) == {}
