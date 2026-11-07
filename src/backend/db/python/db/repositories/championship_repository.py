"""
All database operations for championships and pools.
No business logic — pure SQL in, data out.
"""

import psycopg


def insert_championship(
    cursor: psycopg.Cursor,
    category: str,
    gender: str,
    level: str,
    season_year: str,
    division: int,
    committee_id: int | None = None,
    league_id: int | None = None,
) -> int:
    cursor.execute(
        """
        INSERT INTO championships (category, gender, level, season_year, division, committee_id, league_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (category, gender, level, season_year, division, committee_id, league_id),
    )
    return cursor.fetchone()[0]


def insert_pool(
    cursor: psycopg.Cursor,
    championship_id: int,
    letter: str,
) -> int:
    cursor.execute(
        """
        INSERT INTO pools (championship_id, letter)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (championship_id, letter),
    )
    return cursor.fetchone()[0]
