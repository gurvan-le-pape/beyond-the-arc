"""
All database operations for matches, events, stats, and scheduling.
No business logic — pure SQL in, data out.
"""

from dataclasses import dataclass
from datetime import datetime

import psycopg

from event_rules import EVENT_PLAYER_ROLES


@dataclass
class ScheduledMatch:
    id: int
    matchday: int
    home_team_id: int
    away_team_id: int
    starts_at: datetime


# ---------------------------------------------------------------------------
# Matches
# ---------------------------------------------------------------------------

def insert_scheduled_matches_bulk(
    cursor: psycopg.Cursor,
    rows: list[tuple],
) -> None:
    """
    Bulk insert scheduled matches.
    Each row: (matchday, starts_at, home_team_id, away_team_id)
    """
    cursor.executemany(
        """
        INSERT INTO matches (matchday, starts_at, home_team_id, away_team_id, status)
        VALUES (%s, %s, %s, %s, 'scheduled')
        """,
        rows,
    )


def fetch_due_matches(cursor: psycopg.Cursor) -> list[ScheduledMatch]:
    """Fetch all matches that are due but not yet generated."""
    cursor.execute(
        """
        SELECT id, matchday, home_team_id, away_team_id, starts_at
        FROM matches
        WHERE starts_at <= NOW() AND status = 'scheduled'
        ORDER BY starts_at ASC;
        """
    )
    return [
        ScheduledMatch(
            id=row[0],
            matchday=row[1],
            home_team_id=row[2],
            away_team_id=row[3],
            starts_at=row[4],
        )
        for row in cursor.fetchall()
    ]


def transition_match_status(
    cursor: psycopg.Cursor,
    match_id: int,
    expected: str,
    new: str,
) -> bool:
    """
    Move a match from `expected` to `new`. Returns False, changing nothing, if
    the match is no longer in `expected`.
    """
    cursor.execute(
        "UPDATE matches SET status = %s WHERE id = %s AND status = %s;",
        (new, match_id, expected),
    )
    return cursor.rowcount == 1


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
    """
    Complete a match that is being generated. Raises if it no longer is, so the
    caller's transaction rolls back rather than replacing a result and adding a
    second set of events to it.
    """
    cursor.execute(
        """
        UPDATE matches
        SET home_team_score = %s,
            away_team_score = %s,
            overtime = %s,
            forfeit = %s,
            status = 'completed'
        WHERE id = %s AND status = 'generating';
        """,
        (home_score, away_score, overtime, forfeit, match_id),
    )
    if cursor.rowcount != 1:
        raise RuntimeError(f"Match {match_id} is not generating; its result was not saved.")


# ---------------------------------------------------------------------------
# Match events
# ---------------------------------------------------------------------------

def event_players(event: dict) -> tuple[int | None, int | None]:
    """
    The event's (main, other) player ids, by EVENT_PLAYER_ROLES. Fails on a role
    the table does not name for the event's type, which would otherwise be lost.
    """
    main_role, other_role = EVENT_PLAYER_ROLES[event["event_type"]]
    roles = event.get("player_roles", {})
    unexpected = set(roles) - {main_role, other_role}
    if unexpected:
        raise ValueError(f"{event['event_type']}: unexpected roles {sorted(unexpected)}")
    return roles.get(main_role), roles.get(other_role)


def insert_match_events_bulk(
    cursor: psycopg.Cursor,
    match_id: int,
    events: list[dict],
) -> list[int]:
    """
    Insert all match events and return their IDs in insertion order.
    Uses a single INSERT ... VALUES (...) RETURNING for deterministic ID ordering.
    A shot carries its location; any other event has neither coordinate. An
    event's players go in the columns EVENT_PLAYER_ROLES names for its type.
    """
    rows = []
    for event in events:
        location = event.get("shot_location")
        player_id, other_player_id = event_players(event)
        rows.append((
            match_id,
            event["event_type"],
            event["occurred_at"],
            location["x"] if location else None,
            location["y"] if location else None,
            player_id,
            other_player_id,
        ))

    if not rows:
        return []

    placeholders = ",".join(["(%s,%s,%s,%s,%s,%s,%s)"] * len(rows))
    flat = [val for row in rows for val in row]
    cursor.execute(
        "INSERT INTO match_events "
        "(match_id, event_type, occurred_at, shot_x, shot_y, player_id, other_player_id) "
        f"VALUES {placeholders} RETURNING id",
        flat,
    )

    return [row[0] for row in cursor.fetchall()]


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