"""
All database operations for championships and pools.
No business logic — pure SQL in, data out.
"""

import psycopg2.extensions


def insert_championship(
    cursor: psycopg2.extensions.cursor,
    name: str,
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
        INSERT INTO championships (name, category, gender, level, season_year, division, committee_id, league_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (name, category, gender, level, season_year, division, committee_id, league_id),
    )
    return cursor.fetchone()[0]


def insert_pool(
    cursor: psycopg2.extensions.cursor,
    championship_id: int,
    letter: str,
    name: str,
) -> int:
    cursor.execute(
        """
        INSERT INTO pools (championship_id, letter, name)
        VALUES (%s, %s, %s)
        RETURNING id;
        """,
        (championship_id, letter, name),
    )
    return cursor.fetchone()[0]


def fetch_all_pools(cursor: psycopg2.extensions.cursor) -> list[tuple[int, str]]:
    """Returns list of (pool_id, pool_name)."""
    cursor.execute(
        """
        SELECT pools.id, pools.name
        FROM pools
        JOIN championships ON pools.championship_id = championships.id;
        """
    )
    return cursor.fetchall()