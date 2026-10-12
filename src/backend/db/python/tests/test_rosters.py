"""Generated rosters cover every position, and bodies fit the position."""

import random
from collections import Counter
from statistics import mean

from config import POSITIONS
from utils.player_utils import (
    generate_player_build,
    generate_player_height,
    generate_roster_positions,
)


def test_a_roster_of_twelve_has_two_of_every_position():
    random.seed(1)
    for _ in range(200):
        counts = Counter(generate_roster_positions(12))

        assert sum(counts.values()) == 12
        assert all(counts[position] >= 2 for position in POSITIONS)
        assert counts["C"] == 2  # the spares are guards and forwards


def test_centres_are_taller_than_point_guards():
    random.seed(2)

    def heights(position: str) -> list[int]:
        return [
            generate_player_height("Seniors", "male", generate_player_build(position))
            for _ in range(500)
        ]

    assert mean(heights("C")) > mean(heights("PG")) + 15
