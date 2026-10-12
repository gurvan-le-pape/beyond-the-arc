"""
All database operations for teams and players.
No business logic — pure SQL in, data out.
"""

import psycopg


def fetch_club_ids_for_committee(cursor: psycopg.Cursor, committee_id: int) -> list[int]:
    cursor.execute("SELECT id FROM clubs WHERE committee_id = %s;", (committee_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_committee_ids_for_league(cursor: psycopg.Cursor, league_id: int) -> list[int]:
    cursor.execute("SELECT id FROM committees WHERE league_id = %s;", (league_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_league_ids(cursor: psycopg.Cursor) -> list[int]:
    cursor.execute("SELECT id FROM leagues;")
    return [row[0] for row in cursor.fetchall()]


def fetch_teams_for_committee(
    cursor: psycopg.Cursor,
    committee_id: int,
    gender: str,
    category: str,
    season_year: str,
) -> list[tuple[int, int, int]]:
    """Returns list of (team_id, club_id, team_number)."""
    cursor.execute(
        """
        SELECT teams.id, teams.club_id, teams.number
        FROM teams
        JOIN clubs ON teams.club_id = clubs.id
        WHERE clubs.committee_id = %s AND teams.gender = %s AND teams.category = %s
          AND teams.season_year = %s;
        """,
        (committee_id, gender, category, season_year),
    )
    return cursor.fetchall()


def fetch_teams_for_pool(cursor: psycopg.Cursor, pool_id: int) -> list[int]:
    cursor.execute("SELECT id FROM teams WHERE pool_id = %s;", (pool_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_players_for_team(cursor: psycopg.Cursor, team_id: int) -> list[tuple[int, str, str]]:
    """Returns list of (player_id, player_name, position)."""
    cursor.execute("SELECT id, name, position FROM players WHERE team_id = %s;", (team_id,))
    return cursor.fetchall()


def insert_teams(cursor: psycopg.Cursor, rows: list[tuple]) -> None:
    """
    Bulk insert teams — one row per club's entry into one season.
    Each row: (club_id, season_year, category, gender, number)
    """
    cursor.executemany(
        """
        INSERT INTO teams (club_id, season_year, category, gender, number, pool_id)
        VALUES (%s, %s, %s, %s, %s, NULL);
        """,
        rows,
    )


def fetch_teams_for_clubs(
    cursor: psycopg.Cursor,
    club_ids: list[int],
    season_year: str,
) -> list[tuple[int, str, str]]:
    """Returns list of (team_id, gender, category) for this season's teams belonging to given clubs."""
    cursor.execute(
        "SELECT id, gender, category FROM teams WHERE club_id = ANY(%s) AND season_year = %s;",
        (club_ids, season_year),
    )
    return cursor.fetchall()


def insert_players(cursor: psycopg.Cursor, rows: list[tuple]) -> None:
    """
    Bulk insert players.
    Each row: (name, number, position, height_cm, weight_kg, birthdate, team_id)
    """
    cursor.executemany(
        """
        INSERT INTO players (name, number, position, height_cm, weight_kg, birthdate, team_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (team_id, number) DO NOTHING;
        """,
        rows,
    )


def assign_teams_to_pool(
    cursor: psycopg.Cursor,
    assignments: list[tuple[int, int]],
) -> None:
    """
    Bulk update teams with their pool assignment.
    Each tuple: (pool_id, team_id)

    Uses a single UPDATE ... FROM (VALUES ...) instead of one round-trip per row.
    """
    if not assignments:
        return

    # Build a VALUES list: UPDATE teams SET pool_id = v.pool_id FROM (VALUES (...)) ...
    pool_ids = [a[0] for a in assignments]
    team_ids = [a[1] for a in assignments]

    cursor.execute(
        """
        UPDATE teams
        SET pool_id = data.pool_id
        FROM (
            SELECT unnest(%s::int[]) AS pool_id,
                   unnest(%s::int[]) AS team_id
        ) AS data
        WHERE teams.id = data.team_id;
        """,
        (pool_ids, team_ids),
    )