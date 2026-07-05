"""
Generates player playtime intervals and substitutions for a single match.

This is pure simulation logic with no DB access.
Results are consumed by MatchGenerator before simulation runs.
"""

import random

GAME_DURATION = 40 * 60  # 40 minutes in seconds


def generate(
    players: list[tuple[int, str]],
) -> tuple[dict[int, list[tuple[int, int]]], dict[int, str], list[dict]]:
    """
    Simulate playtime rotations and substitutions for one team.

    Args:
        players: list of (player_id, player_name)

    Returns:
        playtimes: dict of player_id → list of (start_sec, end_sec) intervals
        player_names: dict of player_id → name
        substitutions: list of {time, exiting_player, entering_player}
    """
    if not players:
        return {}, {}, []

    player_ids = [p[0] for p in players]
    player_names = {p[0]: p[1] for p in players}

    active = random.sample(player_ids, min(5, len(player_ids)))  # noqa: S2245
    bench = [p for p in player_ids if p not in active]

    playtimes: dict[int, list[tuple[int, int]]] = {pid: [] for pid in player_ids}
    substitutions: list[dict] = []

    # Give each starter an initial stint
    for pid in active:
        end = random.randint(300, 480)  # noqa: S2245
        playtimes[pid].append((0, end))

    current_time = min(intervals[-1][1] for intervals in playtimes.values() if intervals)

    while current_time < GAME_DURATION:
        # Collect ALL players whose current stint ends at this exact time.
        exiting_now = [
            pid for pid in active if playtimes[pid][-1][1] == current_time
        ]

        for exiting in exiting_now:
            if not bench:
                # Extend their current stint to the end of the game
                playtimes[exiting][-1] = (playtimes[exiting][-1][0], GAME_DURATION)
                continue

            entering = bench.pop(0)
            bench.append(exiting)

            substitutions.append({
                "time": current_time,
                "exiting_player": exiting,
                "entering_player": entering,
            })

            new_end = min(current_time + random.randint(300, 480), GAME_DURATION)  # noqa: S2245
            playtimes[entering].append((current_time, new_end))
            active[active.index(exiting)] = entering

        future_ends = [
            interval[1]
            for intervals in playtimes.values()
            for interval in intervals
            if interval[1] > current_time
        ]
        if not future_ends:
            break
        current_time = min(future_ends)

    return playtimes, player_names, substitutions