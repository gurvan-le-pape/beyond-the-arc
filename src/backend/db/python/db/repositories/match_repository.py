"""
All database operations for matches, events, stats, and scheduling.
No business logic — pure SQL in, data out.
"""

from dataclasses import dataclass
from datetime import datetime

import psycopg


@dataclass
class ScheduledMatch:
    id: int
    pool_id: int
    matchday: int
    home_team_id: int
    away_team_id: int
    scheduled_at: datetime


# ---------------------------------------------------------------------------
# Matches
# ---------------------------------------------------------------------------

def insert_scheduled_matches_bulk(
    cursor: psycopg.Cursor,
    rows: list[tuple],
) -> None:
    """
    Bulk insert scheduled matches.
    Each row: (pool_id, matchday, scheduled_at, home_team_id, away_team_id)
    """
    cursor.executemany(
        """
        INSERT INTO matches (pool_id, matchday, date, home_team_id, away_team_id, status)
        VALUES (%s, %s, %s, %s, %s, 'scheduled')
        """,
        rows,
    )


def fetch_due_matches(cursor: psycopg.Cursor) -> list[ScheduledMatch]:
    """Fetch all matches that are due but not yet generated."""
    cursor.execute(
        """
        SELECT id, pool_id, matchday, home_team_id, away_team_id, date
        FROM matches
        WHERE date <= NOW() AND status = 'scheduled'
        ORDER BY date ASC;
        """
    )
    return [
        ScheduledMatch(
            id=row[0],
            pool_id=row[1],
            matchday=row[2],
            home_team_id=row[3],
            away_team_id=row[4],
            scheduled_at=row[5],
        )
        for row in cursor.fetchall()
    ]


def set_match_status(cursor: psycopg.Cursor, match_id: int, status: str) -> None:
    cursor.execute(
        "UPDATE matches SET status = %s WHERE id = %s;",
        (status, match_id),
    )


def reset_stuck_matches(cursor: psycopg.Cursor) -> int:
    """
    On scheduler startup, reset any matches stuck in 'generating' state
    back to 'scheduled' so they get retried.
    Returns the number of matches reset.
    """
    cursor.execute(
        """
        UPDATE matches SET status = 'scheduled'
        WHERE status = 'generating'
        RETURNING id;
        """
    )
    return cursor.rowcount


def update_match_result(
    cursor: psycopg.Cursor,
    match_id: int,
    home_score: int,
    away_score: int,
    overtime: bool,
    forfeit: bool,
) -> None:
    cursor.execute(
        """
        UPDATE matches
        SET home_team_score = %s,
            away_team_score = %s,
            overtime = %s,
            forfeit = %s,
            status = 'completed'
        WHERE id = %s;
        """,
        (home_score, away_score, overtime, forfeit, match_id),
    )


# ---------------------------------------------------------------------------
# Shot locations
# ---------------------------------------------------------------------------

def insert_shot_locations_bulk(
    cursor: psycopg.Cursor,
    coords: list[tuple[float, float]],
) -> dict[tuple[float, float], int]:
    """
    Insert one shot_location row per coordinate and return a map of (x, y) → id.

    No deduplication: two events at the same spot get two rows, which is fine —
    there's no business rule requiring shared location rows, and the saving is
    negligible for two-decimal coordinates.
    """
    if not coords:
        return {}

    placeholders = ",".join(["(%s,%s)"] * len(coords))
    flat = [val for coord in coords for val in coord]
    cursor.execute(
        f"INSERT INTO shot_locations (x, y) VALUES {placeholders} RETURNING id, x, y",
        flat,
    )

    return {
        (float(row[1]), float(row[2])): row[0]
        for row in cursor.fetchall()
    }


# ---------------------------------------------------------------------------
# Match events
# ---------------------------------------------------------------------------

def insert_match_events_bulk(
    cursor: psycopg.Cursor,
    match_id: int,
    events: list[dict],
    shot_location_cache: dict[tuple[float, float], int],
) -> list[int]:
    """
    Insert all match events and return their IDs in insertion order.
    Uses a single INSERT ... VALUES (...) RETURNING for deterministic ID ordering.
    """
    rows = []
    for event in events:
        shot_location_id = None
        if loc := event.get("shot_location"):
            shot_location_id = shot_location_cache.get((loc["x"], loc["y"]))

        rows.append((
            match_id,
            event["event_type"],
            event["timestamp"],
            event.get("description"),
            shot_location_id,
        ))

    if not rows:
        return []

    placeholders = ",".join(["(%s,%s,%s,%s,%s)"] * len(rows))
    flat = [val for row in rows for val in row]
    cursor.execute(
        f"INSERT INTO match_events (match_id, event_type, timestamp, description, shot_location_id) VALUES {placeholders} RETURNING id",
        flat,
    )

    return [row[0] for row in cursor.fetchall()]


# ---------------------------------------------------------------------------
# Match event players
# ---------------------------------------------------------------------------

def insert_match_event_players_bulk(
    cursor: psycopg.Cursor,
    event_ids: list[int],
    events: list[dict],
) -> None:
    rows = []
    for event_id, event in zip(event_ids, events):
        for role, player_id_or_ids in event.get("player_roles", {}).items():
            # Most roles (shooter, fouler, ...) attach a single player; 'starter'
            # attaches all ten players on court at tip-off, as a list.
            player_ids = (
                player_id_or_ids if isinstance(player_id_or_ids, list) else [player_id_or_ids]
            )
            for player_id in player_ids:
                if player_id is not None:
                    rows.append((event_id, player_id, role))

    if rows:
        cursor.executemany(
            "INSERT INTO match_event_players (event_id, player_id, role) VALUES (%s, %s, %s);",
            rows,
        )


# ---------------------------------------------------------------------------
# Player stats
# ---------------------------------------------------------------------------

def insert_player_stats_bulk(
    cursor: psycopg.Cursor,
    match_id: int,
    rows: list[tuple],
) -> None:
    """
    Each row: (player_id, points, fouls, three_points_made, three_points_attempted,
               two_points_int_made, two_points_int_attempted, two_points_ext_made,
               two_points_ext_attempted, free_throws_made, free_throws_attempted,
               assists, turnovers, rebounds_offensive, rebounds_defensive,
               steals, blocks, playtime_intervals_json)
    """
    cursor.executemany(
        """
        INSERT INTO player_match_stats (
            match_id, player_id, points, fouls,
            three_points_made, three_points_attempted,
            two_points_int_made, two_points_int_attempted,
            two_points_ext_made, two_points_ext_attempted,
            free_throws_made, free_throws_attempted,
            assists, turnovers, rebounds_offensive, rebounds_defensive,
            steals, blocks, playtime_intervals
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (match_id, player_id) DO UPDATE SET
            points = EXCLUDED.points,
            fouls = EXCLUDED.fouls,
            three_points_made = EXCLUDED.three_points_made,
            three_points_attempted = EXCLUDED.three_points_attempted,
            two_points_int_made = EXCLUDED.two_points_int_made,
            two_points_int_attempted = EXCLUDED.two_points_int_attempted,
            two_points_ext_made = EXCLUDED.two_points_ext_made,
            two_points_ext_attempted = EXCLUDED.two_points_ext_attempted,
            free_throws_made = EXCLUDED.free_throws_made,
            free_throws_attempted = EXCLUDED.free_throws_attempted,
            assists = EXCLUDED.assists,
            turnovers = EXCLUDED.turnovers,
            rebounds_offensive = EXCLUDED.rebounds_offensive,
            rebounds_defensive = EXCLUDED.rebounds_defensive,
            steals = EXCLUDED.steals,
            blocks = EXCLUDED.blocks,
            playtime_intervals = EXCLUDED.playtime_intervals;
        """,
        [(match_id, *row) for row in rows],
    )