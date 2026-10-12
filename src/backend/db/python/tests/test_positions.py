"""A player's position shapes what they do on the floor."""

import random
from collections import Counter

import pytest

from simulation.player_picker import pick
from tests.season_sample import simulate_sample


@pytest.fixture(scope="module")
def by_position():
    return simulate_sample(matches=200, seed=5).per_position_player_game


def test_centres_rebound_and_block_more_than_point_guards(by_position):
    centre, guard = by_position["C"], by_position["PG"]

    assert centre["rebounds_defensive"] > 2 * guard["rebounds_defensive"]
    assert centre["blocks"] > 2 * guard["blocks"]


def test_guards_pass_and_shoot_threes_more_than_centres(by_position):
    centre, guard = by_position["C"], by_position["PG"]

    assert guard["assists"] > 2 * centre["assists"]
    assert by_position["SG"]["three_points_attempted"] > 3 * centre["three_points_attempted"]


def test_an_unknown_position_gets_the_neutral_weight():
    random.seed(3)
    picks = Counter(pick([1, 2], "rebound", {1: "C"}) for _ in range(4000))

    # C weighs 2.0 against the neutral 1.0 for player 2, so about two thirds.
    assert 0.62 < picks[1] / 4000 < 0.71
