import os
import time
import logging

import psycopg2
from psycopg2 import pool

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ["DATABASE_URL"]

_pool: pool.ThreadedConnectionPool | None = None


def initialize(retries: int = 5, delay: int = 5) -> None:
    global _pool
    for attempt in range(retries):
        try:
            _pool = pool.ThreadedConnectionPool(minconn=2, maxconn=20, dsn=DATABASE_URL)
            logger.info("Connection pool initialized.")
            return
        except psycopg2.OperationalError as e:
            logger.warning(f"Pool init attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise


def get() -> psycopg2.extensions.connection:
    if _pool is None:
        raise RuntimeError("Connection pool not initialized. Call initialize() first.")
    return _pool.getconn()


def release(conn: psycopg2.extensions.connection) -> None:
    if _pool is not None:
        _pool.putconn(conn)