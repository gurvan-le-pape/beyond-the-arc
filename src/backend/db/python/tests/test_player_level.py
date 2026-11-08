"""Each player has a stable level, and better players do more."""

import random
from collections import Counter
from datetime import datetime, timezone
from statistics import mean

from simulation.player_picker import PLAYER_LEVEL_RANGE, pick, player_level
from tests.season_sample import build_generator, roster


def test_a_players_level_is_stable_and_in_range():
    low, high = PLAYER_LEVEL_RANGE
    for player_id in range(1, 2000):
        assert low <= player_level(player_id) <= high
        assert player_level(player_id) == random.Random(player_id).uniform(low, high)


def test_level_scales_a_players_share_but_not_their_fouls():
    random.seed(9)
    # Two centres; find a pair of ids whose levels differ a lot.
    strong, weak = max(range(1, 200), key=player_level), min(range(1, 200), key=player_level)
    positions = {strong: "C", weak: "C"}

    rebounds = Counter(pick([strong, weak], "rebound", positions) for _ in range(6000))
    fouls = Counter(pick([strong, weak], "foul", positions) for _ in range(6000))

    expected = player_level(strong) / (player_level(strong) + player_level(weak))
    assert abs(rebounds[strong] / 6000 - expected) < 0.03
    assert abs(fouls[strong] / 6000 - 0.5) < 0.03


def test_better_players_score_more():
    random.seed(13)
    generator = build_generator()
    starts_at = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)
    top, bottom = [], []
    for index in range(150):
        result = generator.simulate(roster(index * 100), roster(index * 100 + 12), starts_at)
        for player_id, entry in result.box_score.items():
            level = player_level(int(player_id))
            if level > 1.15:
                top.append(entry["points"])
            elif level < 0.85:
                bottom.append(entry["points"])

    assert mean(top) > 1.3 * mean(bottom)
