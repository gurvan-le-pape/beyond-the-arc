"""Starters play most of the game, the bench in order of level."""

import random
from statistics import mean

from generation.playtime_generator import GAME_DURATION, ON_COURT, generate
from simulation.player_picker import player_level
from tests.season_sample import roster


def minutes(intervals: list[tuple[int, int]]) -> float:
    return sum(end - start for start, end in intervals) / 60


def rotations(count: int):
    random.seed(21)
    for index in range(count):
        players = roster(index * 100)
        playtimes, _, substitutions = generate(players)
        yield players, playtimes, substitutions


def test_five_players_are_always_on_court():
    for _, playtimes, _ in rotations(100):
        for second in range(0, GAME_DURATION, 7):
            on_court = sum(
                any(start <= second < end for start, end in intervals)
                for intervals in playtimes.values()
            )
            assert on_court == ON_COURT

        assert sum(minutes(i) for i in playtimes.values()) == ON_COURT * GAME_DURATION / 60


def test_starters_are_the_best_player_at_each_position():
    for players, playtimes, _ in rotations(100):
        starters = [pid for pid, intervals in playtimes.items() if intervals and intervals[0][0] == 0]
        position = {pid: pos for pid, _, pos in players}

        assert sorted(position[s] for s in starters) == sorted(["PG", "SG", "SF", "PF", "C"])
        for starter in starters:
            same_position = [pid for pid in position if position[pid] == position[starter]]
            assert starter == max(same_position, key=player_level)


def test_starters_play_most_of_the_game_and_the_last_bench_spots_little():
    starters, last_bench = [], []
    for players, playtimes, _ in rotations(200):
        ranked = sorted(playtimes, key=lambda pid: minutes(playtimes[pid]), reverse=True)
        starters.extend(minutes(playtimes[pid]) for pid in ranked[:ON_COURT])
        last_bench.extend(minutes(playtimes[pid]) for pid in ranked[-3:])

    assert mean(starters) > 25
    assert mean(last_bench) < 6
