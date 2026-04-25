"""
Scheduler

Long-running process that:
  1. On startup, runs SeasonGenerator if the season hasn't been set up yet.
  2. Polls the database every minute for matches whose scheduled_at has passed
     and generates their simulated results.

Match status lifecycle:
  scheduled → generating → completed
                         ↘ failed      (on error; will not be retried automatically)

On restart, any 'generating' matches are reset to 'scheduled' so they are retried.
"""

import logging
import time
from concurrent.futures import ThreadPoolExecutor

from db import connection
from db.repositories import match_repository
from db.repositories.match_repository import ScheduledMatch
from generation.match_generator import MatchGenerator
from generation.season_generator import SeasonGenerator
from simulation.match_simulator import MatchSimulator
from config import GAME_CONFIG_PATH

import json

logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = 60


class Scheduler:
    def __init__(self, max_workers: int = 8) -> None:
        with open(GAME_CONFIG_PATH) as f:
            game_config = json.load(f)

        simulator = MatchSimulator(
            game_config["game_states"],
            game_config["transition_events"],
        )
        self.match_generator = MatchGenerator(simulator)
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def run(self) -> None:
        self._recover_stuck_matches()
        self._ensure_season_setup()

        logger.info(f"Scheduler polling every {POLL_INTERVAL_SECONDS}s.")
        while True:
            self._poll()
            time.sleep(POLL_INTERVAL_SECONDS)

    # ------------------------------------------------------------------
    # Startup
    # ------------------------------------------------------------------

    def _recover_stuck_matches(self) -> None:
        conn = connection.get()
        try:
            with conn.cursor() as cursor:
                count = match_repository.reset_stuck_matches(cursor)
            conn.commit()
            if count:
                logger.warning(f"Reset {count} stuck 'generating' match(es) to 'scheduled'.")
        finally:
            connection.release(conn)

    def _ensure_season_setup(self) -> None:
        SeasonGenerator().run()

    # ------------------------------------------------------------------
    # Poll loop
    # ------------------------------------------------------------------

    def _poll(self) -> None:
        conn = connection.get()
        try:
            with conn.cursor() as cursor:
                due = match_repository.fetch_due_matches(cursor)
                for match in due:
                    match_repository.set_match_status(cursor, match.id, "generating")
            conn.commit()
        finally:
            connection.release(conn)

        for match in due:
            self.executor.submit(self._generate, match)

        if due:
            logger.info(f"Dispatched {len(due)} match(es) for generation.")

    def _generate(self, match: ScheduledMatch) -> None:
        conn = connection.get()
        try:
            with conn.cursor() as cursor:
                self.match_generator.generate(cursor, match)
                match_repository.set_match_status(cursor, match.id, "completed")
            conn.commit()
        except Exception:
            logger.exception(f"Match {match.id}: generation failed.")
            try:
                conn.rollback()
                with conn.cursor() as cursor:
                    match_repository.set_match_status(cursor, match.id, "failed")
                conn.commit()
            except Exception:
                logger.exception(f"Match {match.id}: failed to update status to 'failed'.")
        finally:
            connection.release(conn)