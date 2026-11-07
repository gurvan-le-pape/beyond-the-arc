"""
All database operations for teams and players.
No business logic — pure SQL in, data out.
"""

import psycopg


def fetch_club_ids_for_committee(cursor: psycopg.Cursor, committee_id: int) -> list[int]:
    cursor.execute("SELECT id FROM clubs WHERE committee_id = %s ORDER BY id;", (committee_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_committee_ids_for_league(cursor: psycopg.Cursor, league_id: int) -> list[int]:
    cursor.execute("SELECT id FROM committees WHERE league_id = %s ORDER BY id;", (league_id,))
    return [row[0] for row in cursor.fetchall()]


def fetch_league_ids(cursor: psycopg.Cursor) -> list[int]:
    cursor.execute("SELECT id FROM leagues ORDER BY id;")
    return [row[0] for row in cursor.fetchall()]


def league_has_teams(cursor: psycopg.Cursor, league_id: int, season_year: str) -> bool:
    """Whether any of the league's clubs has a team in this season's championships."""
    cursor.execute(
        """
        SELECT EXISTS (
            SELECT 1
            FROM teams
            JOIN pools ON pools.id = teams.pool_id
            JOIN championships ON championships.id = pools.championship_id
            JOIN clubs ON clubs.id = teams.club_id
            JOIN committees ON committees.id = clubs.committee_id
            WHERE championships.season_year = %s AND committees.league_id = %s
        );
        """,
        (season_year, league_id),
    )
    return cursor.fetchone()[0]


def fetch_players_for_team(cursor: psycopg.Cursor, team_id: int) -> list[tuple[int, str, str]]:
    """Returns list of (player_id, player_name, position)."""
    cursor.execute("SELECT id, name, position FROM players WHERE team_id = %s;", (team_id,))
    return cursor.fetchall()


def insert_teams(cursor: psycopg.Cursor, rows: list[tuple[int, int, int]]) -> list[int]:
    """
    Inserts one pool's teams and returns their ids, in the order of `rows`.
    Each row: (pool_id, club_id, number)
    """
    if not rows:
        return []
    cursor.executemany(
        "INSERT INTO teams (pool_id, club_id, number) VALUES (%s, %s, %s) RETURNING id;",
        rows,
        returning=True,
    )
    ids = []
    while True:
        ids.append(cursor.fetchone()[0])
        if not cursor.nextset():
            return ids


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
