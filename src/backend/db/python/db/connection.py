"""
Database connection pool using psycopg3 (psycopg).
"""

import logging
import os
import time

from psycopg_pool import ConnectionPool

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ["DATABASE_URL"]

_pool: ConnectionPool | None = None


def initialize(retries: int = 5, delay: int = 5) -> None:
    global _pool
    for attempt in range(retries):
        try:
            _pool = ConnectionPool(
                conninfo=DATABASE_URL,
                min_size=4,
                max_size=32,
                open=True,
            )
            logger.info("Connection pool initialized.")
            return
        except Exception as e:
            logger.warning(f"Pool init attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise


def get_pool() -> ConnectionPool:
    """Return the pool directly, for use as a context manager:

        with connection.get_pool().connection() as conn:
            ...

    The context manager commits on clean exit and always returns the
    connection cleanly — no rollback-on-return warnings.
    """
    if _pool is None:
        raise RuntimeError("Connection pool not initialized. Call initialize() first.")
    return _pool


# ---------------------------------------------------------------------------
# Deprecated helpers — kept for any callers not yet migrated to get_pool().
# New code should use get_pool().connection() as a context manager instead;
# that pattern handles commit, rollback, and connection return automatically.
# These will be removed once all callers are migrated.
# ---------------------------------------------------------------------------

def get():
    """Deprecated: borrow a connection from the pool manually.

    Prefer:
        with connection.get_pool().connection() as conn:
            ...
    """
    if _pool is None:
        raise RuntimeError("Connection pool not initialized. Call initialize() first.")
    return _pool.getconn()


def release(conn) -> None:
    """Deprecated: return a connection borrowed via get().

    Prefer get_pool().connection() which handles this automatically.
    """
    if _pool is not None:
        _pool.putconn(conn)