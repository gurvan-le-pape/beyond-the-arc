"""
Scheduler

Uses ProcessPoolExecutor instead of ThreadPoolExecutor so each worker gets
its own Python process and GIL — removing the CPU bottleneck from the
simulation loop.

Each worker process initializes its own DB connection pool on first use.
"""

import json
import logging
import time
from concurrent.futures import ProcessPoolExecutor

from config import GAME_CONFIG_PATH
from db import connection
from db.repositories import match_repository
from db.repositories.match_repository import ScheduledMatch
from generation.match_generator import MatchGenerator
from generation.season_generator import SeasonGenerator
from simulation.match_simulator import MatchSimulator

logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = 60
MAX_WORKERS = 8  # true parallel processes


# ---------------------------------------------------------------------------
# Worker-level state (initialised once per process)
# ---------------------------------------------------------------------------

_match_generator: MatchGenerator | None = None


def _worker_init() -> None:
    """Called once when each worker process starts."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    connection.initialize()

    with open(GAME_CONFIG_PATH) as f:
        game_config = json.load(f)

    simulator = MatchSimulator(
        game_config["game_states"],
        game_config["transition_events"],
    )

    global _match_generator
    _match_generator = MatchGenerator(simulator)


def _generate_worker(match: ScheduledMatch) -> None:
    """Runs inside a worker process.

    update_match_result() already sets status = 'completed' as part of its
    UPDATE, so there is no separate set_match_status call needed on the
    happy path.
    """
    with connection.get_pool().connection() as conn:
        conn.autocommit = False
        try:
            with conn.cursor() as cursor:
                _match_generator.generate(cursor, match)
            conn.commit()
        except Exception:
            logging.getLogger(__name__).exception(f"Match {match.id}: generation failed.")
            try:
                conn.rollback()
                with conn.cursor() as cursor:
                    match_repository.set_match_status(cursor, match.id, "failed")
                conn.commit()
            except Exception:
                logging.getLogger(__name__).exception(
                    f"Match {match.id}: failed to update status to 'failed'."
                )


# ---------------------------------------------------------------------------
# Scheduler
# ---------------------------------------------------------------------------

class Scheduler:
    def __init__(self) -> None:
        self.executor = ProcessPoolExecutor(
            max_workers=MAX_WORKERS,
            initializer=_worker_init,
        )

    def run(self) -> None:
        self._recover_stuck_matches()
        self._ensure_season_setup()

        logger.info(f"Scheduler polling every {POLL_INTERVAL_SECONDS}s.")
        try:
            while True:
                self._poll()
                time.sleep(POLL_INTERVAL_SECONDS)
        finally:
            # Ensure worker processes are reaped cleanly on KeyboardInterrupt
            # or any other exit so they don't linger with open DB connections.
            self.executor.shutdown(wait=True)

    def _recover_stuck_matches(self) -> None:
        count = 0
        with connection.get_pool().connection() as conn:
            with conn.cursor() as cursor:
                count = match_repository.reset_stuck_matches(cursor)
            conn.commit()
        if count:
            logger.warning(f"Reset {count} stuck 'generating' match(es) to 'scheduled'.")

    def _ensure_season_setup(self) -> None:
        SeasonGenerator().run()

    def _poll(self) -> None:
        due = []
        with connection.get_pool().connection() as conn:
            with conn.cursor() as cursor:
                due = match_repository.fetch_due_matches(cursor)
                for match in due:
                    match_repository.set_match_status(cursor, match.id, "generating")
            conn.commit()

        for match in due:
            self.executor.submit(_generate_worker, match)

        if due:
            logger.info(f"Dispatched {len(due)} match(es) for generation.")