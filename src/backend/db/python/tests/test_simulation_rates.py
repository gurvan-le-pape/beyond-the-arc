"""
Box-score rates over a seeded sample of simulated matches.

The bounds are realistic ranges for a team over one game, wide enough that a
change of seed does not cross them and narrow enough that a regression to the
old behaviour (9.3 shot clock violations, 20.7 turnovers) does.
"""

import pytest

from tests.season_sample import simulate_sample


@pytest.fixture(scope="module")
def sample():
    return simulate_sample(matches=200, seed=7)


def test_teams_rarely_run_the_shot_clock_out(sample):
    assert sample.events_per_team_game.get("shot_clock_violation", 0) < 1.0


def test_turnovers_stay_in_a_realistic_range(sample):
    assert 6.0 <= sample.per_team_game["turnovers"] <= 16.0
