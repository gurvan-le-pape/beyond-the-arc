"""
Simulates a sample of matches with no database and reports per-team averages.

The simulator is random by design, so its behaviour is only observable in
aggregate. This is the measuring instrument for that: a seeded run of many
matches between two synthetic 12-player rosters, reduced to the per-team,
per-game figures a box score would show.
"""

import json
import random
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone

from config import GAME_CONFIG_PATH
from generation.match_generator import MatchGenerator
from simulation.match_simulator import MatchSimulator

ROSTER_SIZE = 12

# Column order of a stat row, after the leading player id — see
# generation.match_generator.compute_player_stats.
STAT_COLUMNS = (
    "points", "fouls",
    "three_points_made", "three_points_attempted",
    "two_points_int_made", "two_points_int_attempted",
    "two_points_ext_made", "two_points_ext_attempted",
    "free_throws_made", "free_throws_attempted",
    "assists", "turnovers",
    "rebounds_offensive", "rebounds_defensive",
    "steals", "blocks",
)


@dataclass
class SampleReport:
    matches: int
    per_team_game: dict[str, float]
    events_per_team_game: dict[str, float]


def build_generator() -> MatchGenerator:
    with open(GAME_CONFIG_PATH) as f:
        game_config = json.load(f)
    simulator = MatchSimulator(game_config["game_states"], game_config["transition_events"])
    return MatchGenerator(simulator)


def roster(first_id: int) -> list[tuple[int, str]]:
    return [(first_id + i, f"Player {first_id + i}") for i in range(ROSTER_SIZE)]


def simulate_sample(matches: int, seed: int) -> SampleReport:
    random.seed(seed)
    generator = build_generator()
    starts_at = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)

    stat_totals: Counter[str] = Counter()
    event_totals: Counter[str] = Counter()
    for index in range(matches):
        base = index * 100
        result = generator.simulate(roster(base), roster(base + ROSTER_SIZE), starts_at)
        for row in result.stat_rows:
            for column, value in zip(STAT_COLUMNS, row[1:-1]):
                stat_totals[column] += value
        event_totals.update(e["event_type"] for e in result.events)

    team_games = matches * 2
    return SampleReport(
        matches=matches,
        per_team_game={k: v / team_games for k, v in stat_totals.items()},
        events_per_team_game={k: v / team_games for k, v in event_totals.items()},
    )


if __name__ == "__main__":
    report = simulate_sample(matches=300, seed=1)
    for name, value in sorted(report.per_team_game.items()):
        print(f"{name:28} {value:6.2f}")
    print()
    for name, value in sorted(report.events_per_team_game.items(), key=lambda kv: -kv[1])[:20]:
        print(f"{name:28} {value:6.2f}")
