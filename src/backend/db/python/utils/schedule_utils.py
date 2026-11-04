"""
Schedule computation for a basketball season.

At the start of a season, every pool plays a round-robin schedule (home + away legs).
All matches for a given matchday fall on the same weekend.
The exact slot (day + time) is picked randomly from a fixed set of options.
"""

import random
from datetime import datetime
from zoneinfo import ZoneInfo

PARIS = ZoneInfo("Europe/Paris")
UTC = ZoneInfo("UTC")

# Available slots: (weekday, hour, minute), local Paris time.
# weekday is ISO, as datetime.fromisocalendar reads it: 6 = Saturday, 7 = Sunday.
SLOT_OPTIONS: list[tuple[int, int, int]] = [
    (6, 14, 0),   # Saturday 14:00
    (6, 19, 0),   # Saturday 19:00
    (6, 22, 0),   # Saturday 22:00
    (7, 14, 0),   # Sunday 14:00
    (7, 19, 0),   # Sunday 19:00
    (7, 22, 0),   # Sunday 22:00
]


def get_first_weekend_of_week(iso_week: int, year: int) -> datetime:
    """Return the Saturday of the given ISO week number as a date."""
    # ISO week Monday = weekday 1; Saturday = weekday 6
    return datetime.fromisocalendar(year, iso_week, 6)


def compute_matchday_datetime(season_start_week: int, season_start_year: int, matchday: int, pool_id: int) -> datetime:
    """
    Compute the scheduled datetime (UTC) for a given matchday.
    Slot is deterministic per (pool_id, matchday) — reruns produce identical schedules.
    """
    week = season_start_week + (matchday - 1)
    year = season_start_year

    # Handle week overflow into next year
    weeks_in_year = datetime(year, 12, 28).isocalendar()[1]  # Dec 28 is always in last week
    while week > weeks_in_year:
        week -= weeks_in_year
        year += 1
        weeks_in_year = datetime(year, 12, 28).isocalendar()[1]

    rng = random.Random(pool_id * 10000 + matchday)
    weekday, hour, minute = rng.choice(SLOT_OPTIONS) # noqa: S2245
    base = datetime.fromisocalendar(year, week, weekday)
    local_dt = datetime(base.year, base.month, base.day, hour, minute, tzinfo=PARIS)
    return local_dt.astimezone(UTC)


def build_round_robin_schedule(teams: list[int]) -> list[list[tuple[int, int]]]:
    """
    Generate a full round-robin schedule (home + return legs) for a list of team IDs.
    Returns a list of rounds, each round being a list of (home_team_id, away_team_id) pairs.
    """
    if len(teams) % 2 != 0:
        teams = teams + [None]  # bye

    n = len(teams)
    half = n // 2
    rotation = list(teams)
    rounds = []

    for _ in range(n - 1):
        pairs = [
            (rotation[i], rotation[n - i - 1])
            for i in range(half)
            if rotation[i] is not None and rotation[n - i - 1] is not None
        ]
        rounds.append(pairs)
        # Rotate all except the first element
        rotation = [rotation[0]] + [rotation[-1]] + rotation[1:-1]

    # Add return leg (swap home/away)
    return_leg = [[(away, home) for home, away in rnd] for rnd in rounds]
    return rounds + return_leg