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

from config import FORFEIT_ODDS, GAME_CONFIG_PATH
from generation.match_generator import STAT_COLUMNS, MatchGenerator, draw_forfeit
from simulation.match_simulator import MatchSimulator

ROSTER_SIZE = 12


@dataclass
class SampleReport:
    matches: int
    per_team_game: dict[str, float]
    events_per_team_game: dict[str, float]
    # Position -> stat -> average per player and game, for players who played.
    per_position_player_game: dict[str, dict[str, float]]


def build_generator() -> MatchGenerator:
    with open(GAME_CONFIG_PATH) as f:
        game_config = json.load(f)
    simulator = MatchSimulator(game_config["game_states"], game_config["transition_events"])
    return MatchGenerator(simulator)


# Two of each position, then a spare guard and forward: a balanced 12.
ROSTER_POSITIONS = ("PG", "SG", "SF", "PF", "C") * 2 + ("SG", "SF")


def roster(first_id: int) -> list[tuple[int, str, str]]:
    return [
        (first_id + i, f"Player {first_id + i}", position)
        for i, position in enumerate(ROSTER_POSITIONS)
    ]


def simulate_sample(matches: int, seed: int) -> SampleReport:
    random.seed(seed)
    generator = build_generator()
    starts_at = datetime(2026, 1, 10, 20, 0, tzinfo=timezone.utc)

    stat_totals: Counter[str] = Counter()
    event_totals: Counter[str] = Counter()
    position_totals: dict[str, Counter[str]] = {}
    position_games: Counter[str] = Counter()
    for index in range(matches):
        base = index * 100
        home, away = roster(base), roster(base + ROSTER_SIZE)
        positions = {player_id: position for player_id, _, position in home + away}
        result = generator.simulate(home, away, starts_at)
        for player_id, entry in result.box_score.items():
            position = positions[int(player_id)]
            position_games[position] += 1
            for column in STAT_COLUMNS:
                stat_totals[column] += entry[column]
                position_totals.setdefault(position, Counter())[column] += entry[column]
        event_totals.update(e["event_type"] for e in result.events)

    team_games = matches * 2
    return SampleReport(
        matches=matches,
        per_team_game={k: v / team_games for k, v in stat_totals.items()},
        events_per_team_game={k: v / team_games for k, v in event_totals.items()},
        per_position_player_game={
            position: {k: v / position_games[position] for k, v in totals.items()}
            for position, totals in position_totals.items()
        },
    )


def forfeit_rates(draws: int, seed: int) -> dict[str, float]:
    """The share of matches forfeited at each level, over `draws` draws each."""
    rng = random.Random(seed)
    return {
        level: sum(draw_forfeit(level, rng) is not None for _ in range(draws)) / draws
        for level in FORFEIT_ODDS
    }


if __name__ == "__main__":
    report = simulate_sample(matches=300, seed=1)
    for name, value in sorted(report.per_team_game.items()):
        print(f"{name:28} {value:6.2f}")
    print()
    for name, value in sorted(report.events_per_team_game.items(), key=lambda kv: -kv[1])[:20]:
        print(f"{name:28} {value:6.2f}")
    print()
    shown = ("points", "three_points_attempted", "two_points_int_attempted", "assists",
             "rebounds_offensive", "rebounds_defensive", "steals", "blocks", "turnovers", "fouls")
    print("per player and game " + "".join(f"{p:>7}" for p in ROSTER_POSITIONS[:5]))
    for name in shown:
        values = "".join(f"{report.per_position_player_game[p].get(name, 0):7.2f}" for p in ROSTER_POSITIONS[:5])
        print(f"{name:28}{values}")
    print()
    print("forfeit rate            drawn    odds")
    for level, rate in forfeit_rates(draws=100_000, seed=1).items():
        print(f"{level:20} {rate:8.4f} {FORFEIT_ODDS[level]:7.4f}")
