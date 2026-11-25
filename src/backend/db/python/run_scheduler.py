"""
Entry point for the long-running scheduler service.

Initializes the DB connection pool, then hands off to Scheduler.run()
which handles season setup and the match generation poll loop.
"""

import logging

from db import connection
from scheduler import Scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

if __name__ == "__main__":
    connection.initialize()
    try:
        Scheduler().run()
    finally:
        connection.get_pool().close()