"""
Checkpoint tracking for resumable seeding.

A checkpoint marks that a unit of work (e.g. a league's season setup,
a specific match) has been fully committed to the database. On restart,
completed units are skipped automatically.

Usage:
    # Before processing
    if checkpoints.is_done("league_setup", league_id):
        return

    # Inside the same transaction as your data inserts, before commit
    checkpoints.mark_done(cursor, "league_setup", league_id)
    conn.commit()
"""

import logging

import psycopg2.extensions

from db import connection

logger = logging.getLogger(__name__)

EntityType = str  # e.g. "league_setup", "match_generated"


def is_done(entity_type: EntityType, entity_id: int) -> bool:
    """Return True if this entity has already been fully processed."""
    conn = connection.get()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT 1 FROM seeding_checkpoints
                WHERE entity_type = %s AND entity_id = %s AND status = 'completed';
                """,
                (entity_type, entity_id),
            )
            return cursor.fetchone() is not None
    finally:
        connection.release(conn)


def mark_done(cursor: psycopg2.extensions.cursor, entity_type: EntityType, entity_id: int) -> None:
    """
    Insert a completed checkpoint. Must be called within an open transaction —
    the caller is responsible for committing.
    """
    cursor.execute(
        """
        INSERT INTO seeding_checkpoints (entity_type, entity_id, status)
        VALUES (%s, %s, 'completed')
        ON CONFLICT (entity_type, entity_id) DO NOTHING;
        """,
        (entity_type, entity_id),
    )