"""
Generates player playtime intervals and substitutions for a single match.

This is pure simulation logic with no DB access.
Results are consumed by MatchGenerator before simulation runs.

The coach starts the best player at each position (by player level) and
gives the rest of the roster minutes in order of level. Every few minutes
they take off whoever is furthest ahead of their target minutes and send on
whoever is furthest behind.
"""

import random

from simulation.player_picker import player_level

GAME_DURATION = 40 * 60  # 40 minutes in seconds
ON_COURT = 5

# Target minutes by rank, for a 12-player roster: the five starters, then the
# bench from best to worst. They add up to 200, five players for 40 minutes;
# another roster size takes the first ranks and is rescaled to that total.
TARGET_MINUTES = (29, 29, 29, 29, 29, 16, 12, 10, 7, 5, 3, 2)

# Seconds between two rounds of substitutions.
ROTATION_INTERVAL = (120, 240)


def _rotation_order(players: list[tuple]) -> list[int]:
    """Starters first (the best player at each position), then the bench by level."""
    by_level = sorted((p[0] for p in players), key=player_level, reverse=True)
    position = {p[0]: p[2] for p in players if len(p) > 2}

    starters: list[int] = []
    covered: set[str] = set()
    for player_id in by_level:
        player_position = position.get(player_id)
        if player_position is not None and player_position not in covered:
            starters.append(player_id)
            covered.add(player_position)
        if len(starters) == ON_COURT:
            break
    # A roster missing a position fills the gap with its best remaining players.
    for player_id in by_level:
        if len(starters) == ON_COURT:
            break
        if player_id not in starters:
            starters.append(player_id)

    return starters + [p for p in by_level if p not in starters]


def _target_seconds(order: list[int]) -> dict[int, float]:
    minutes = [TARGET_MINUTES[min(rank, len(TARGET_MINUTES) - 1)] for rank in range(len(order))]
    scale = ON_COURT * GAME_DURATION / (sum(minutes) * 60)
    return {player_id: m * 60 * scale for player_id, m in zip(order, minutes)}


def generate(
    players: list[tuple],
) -> tuple[dict[int, list[tuple[int, int]]], list[dict]]:
    """
    Simulate playtime rotations and substitutions for one team.

    Args:
        players: list of (player_id, player_name, position); position is optional

    Returns:
        playtimes: dict of player_id → list of (start_sec, end_sec) intervals
        substitutions: list of {time, exiting_player, entering_player}
    """
    if not players:
        return {}, []

    order = _rotation_order(players)
    target = _target_seconds(order)

    active = order[:ON_COURT]
    bench = order[ON_COURT:]
    playtimes: dict[int, list[tuple[int, int]]] = {pid: [] for pid in order}
    stint_start = dict.fromkeys(active, 0)
    played = dict.fromkeys(order, 0.0)
    substitutions: list[dict] = []

    now = 0
    while True:
        now += random.randint(*ROTATION_INTERVAL)  # noqa: S2245
        if now >= GAME_DURATION or not bench:
            break

        def ahead(pid: int) -> float:
            # Seconds played beyond the target pace at `now` (negative: behind).
            on_court = now - stint_start[pid] if pid in stint_start else 0
            return played[pid] + on_court - target[pid] * now / GAME_DURATION

        for _ in range(random.randint(1, 2)):  # noqa: S2245
            exiting = max(active, key=ahead)
            entering = min(bench, key=ahead)
            if ahead(entering) >= 0 or ahead(exiting) <= ahead(entering):
                break

            started = stint_start.pop(exiting)
            played[exiting] += now - started
            playtimes[exiting].append((started, now))
            stint_start[entering] = now
            active[active.index(exiting)] = entering
            bench[bench.index(entering)] = exiting
            substitutions.append({"time": now, "exiting_player": exiting, "entering_player": entering})

    for pid in active:
        playtimes[pid].append((stint_start[pid], GAME_DURATION))

    return playtimes, substitutions
