"""
All database operations for teams and players.
No business logic — pure SQL in, data out.
"""

import psycopg2.extensions


def fetch_club_ids_for_committee(cursor: psycopg2.extensions.cursor, committee_id: int) -> list[int]:
    cursor.execute("SELECT id FROM clubs WHERE committee_id = %s;", (committee_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_committee_ids_for_league(cursor: psycopg2.extensions.cursor, league_id: int) -> list[int]:
    cursor.execute("SELECT id FROM committees WHERE league_id = %s;", (league_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_league_ids(cursor: psycopg2.extensions.cursor) -> list[int]:
    cursor.execute("SELECT id FROM leagues;")
    return [row[0] for row in cursor.fetchall()]


def fetch_teams_for_committee(
    cursor: psycopg2.extensions.cursor,
    committee_id: int,
    gender: str,
    category: str,
) -> list[tuple[int, int, int]]:
    """Returns list of (team_id, club_id, team_number)."""
    cursor.execute(
        """
        SELECT teams.id, teams.club_id, teams.number
        FROM teams
        JOIN clubs ON teams.club_id = clubs.id
        WHERE clubs.committee_id = %s AND teams.gender = %s AND teams.category = %s;
        """,
        (committee_id, gender, category),
    )
    return cursor.fetchall()


def fetch_teams_for_pool(cursor: psycopg2.extensions.cursor, pool_id: int) -> list[int]:
    cursor.execute("SELECT id FROM teams WHERE pool_id = %s;", (pool_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_players_for_team(cursor: psycopg2.extensions.cursor, team_id: int) -> list[tuple[int, str]]:
    """Returns list of (player_id, player_name)."""
    cursor.execute("SELECT id, name FROM players WHERE team_id = %s;", (team_id,))
    return cursor.fetchall()


def insert_teams(cursor: psycopg2.extensions.cursor, rows: list[tuple]) -> None:
    """
    Bulk insert teams.
    Each row: (club_id, category, gender, number)
    """
    cursor.executemany(
        """
        INSERT INTO teams (club_id, category, gender, number, pool_id)
        VALUES (%s, %s, %s, %s, NULL);
        """,
        rows,
    )


def fetch_team_ids_and_genders_for_clubs(
    cursor: psycopg2.extensions.cursor,
    club_ids: list[int],
) -> list[tuple[int, str]]:
    """Returns list of (team_id, gender) for all teams belonging to given clubs."""
    cursor.execute(
        "SELECT id, gender FROM teams WHERE club_id = ANY(%s);",
        (club_ids,),
    )
    return cursor.fetchall()


def insert_players(cursor: psycopg2.extensions.cursor, rows: list[tuple]) -> None:
    """
    Bulk insert players.
    Each row: (name, number, team_id)
    """
    cursor.executemany(
        """
        INSERT INTO players (name, number, team_id)
        VALUES (%s, %s, %s)
        ON CONFLICT (team_id, number) DO NOTHING;
        """,
        rows,
    )


def assign_teams_to_pool(
    cursor: psycopg2.extensions.cursor,
    assignments: list[tuple[int, int]],
) -> None:
    """
    Bulk update teams with their pool assignment.
    Each tuple: (pool_id, team_id)
    """
    cursor.executemany(
        "UPDATE teams SET pool_id = %s WHERE id = %s;",
        assignments,
    )