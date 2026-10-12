"""
Who on the floor takes part in an action.

Every action draws one player from the five on court, weighted by position:
a centre rebounds and blocks far more than a point guard, who in turn
passes, steals and shoots threes far more. A weight of 1.0 is the neutral
share; a player whose position is unknown gets it for every action.
"""

import random

# Action -> position -> relative weight. Shot actions use the shot categories
# of event_rules ("three", "two_int", "two_ext").
POSITION_WEIGHTS: dict[str, dict[str, float]] = {
    "three":    {"PG": 1.3, "SG": 1.5, "SF": 1.1, "PF": 0.6, "C": 0.2},
    "two_int":  {"PG": 0.8, "SG": 0.8, "SF": 1.0, "PF": 1.3, "C": 1.6},
    "two_ext":  {"PG": 1.0, "SG": 1.1, "SF": 1.1, "PF": 1.0, "C": 0.8},
    "assist":   {"PG": 2.5, "SG": 1.3, "SF": 1.0, "PF": 0.7, "C": 0.5},
    "rebound":  {"PG": 0.5, "SG": 0.6, "SF": 1.0, "PF": 1.5, "C": 2.0},
    "block":    {"PG": 0.2, "SG": 0.4, "SF": 0.8, "PF": 1.5, "C": 2.5},
    "steal":    {"PG": 1.6, "SG": 1.4, "SF": 1.0, "PF": 0.7, "C": 0.4},
    "turnover": {"PG": 1.5, "SG": 1.2, "SF": 1.0, "PF": 0.8, "C": 0.7},
    "foul":     {"PG": 0.8, "SG": 0.9, "SF": 1.0, "PF": 1.2, "C": 1.3},
}


def pick(players: list[int], action: str, positions: dict[int, str]) -> int:
    """Draw the player who performs `action` among `players`."""
    by_position = POSITION_WEIGHTS[action]
    weights = [by_position.get(positions.get(player), 1.0) for player in players]
    return random.choices(players, weights=weights)[0]  # noqa: S2245
