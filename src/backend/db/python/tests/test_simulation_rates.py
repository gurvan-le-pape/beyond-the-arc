"""
Box-score rates over a seeded sample of simulated matches.

The bounds are realistic ranges for an amateur team over one 40-minute game,
wide enough that a change of seed does not cross them and narrow enough that
the simulator's earlier behaviour (9.3 shot clock violations, 20.7 turnovers,
52% from three, 1.8 steals) does.
"""

import pytest

from tests.season_sample import simulate_sample


@pytest.fixture(scope="module")
def sample():
    return simulate_sample(matches=200, seed=7)


def share(sample, made: str, attempted: str) -> float:
    return sample.per_team_game[made] / sample.per_team_game[attempted]


def test_teams_rarely_run_the_shot_clock_out(sample):
    assert sample.events_per_team_game.get("shot_clock_violation", 0) < 1.0


@pytest.mark.parametrize(
    ("stat", "low", "high"),
    [
        ("points", 60, 80),
        ("turnovers", 10, 16),
        ("steals", 5, 9),
        ("blocks", 2, 5),
        ("fouls", 14, 21),
        ("free_throws_attempted", 14, 24),
        ("assists", 10, 18),
        ("rebounds_offensive", 6, 12),
        ("rebounds_defensive", 17, 26),
    ],
)
def test_per_game_totals_stay_realistic(sample, stat, low, high):
    assert low <= sample.per_team_game[stat] <= high


@pytest.mark.parametrize(
    ("made", "attempted", "low", "high"),
    [
        ("three_points_made", "three_points_attempted", 0.30, 0.40),
        ("two_points_int_made", "two_points_int_attempted", 0.48, 0.62),
        ("two_points_ext_made", "two_points_ext_attempted", 0.36, 0.50),
        ("free_throws_made", "free_throws_attempted", 0.65, 0.80),
    ],
)
def test_shooting_percentages_stay_realistic(sample, made, attempted, low, high):
    assert low <= share(sample, made, attempted) <= high
