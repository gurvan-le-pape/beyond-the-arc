"""
SeasonGenerator

Runs once at the start of a season, one transaction per league, and skips a
league that already has teams in this season's championships.

For each league, gender and category:
  1. Draw each committee's entries: which clubs field teams, and their numbers
  2. Split each committee's entries ~80/20 between its departmental
     championships and the league's regional ones
  3. Create the championships and pools, then each pool's teams, their players
     and the pool's round-robin schedule (match shells with starts_at)

A team is created in its pool, so every team has one.
"""

import logging
import math
import random

from config import CATEGORIES, GENDERS, SEASON_YEAR, SEASON_START_WEEK, SEASON_START_YEAR
from db import connection
from db.repositories import championship_repository, match_repository, team_repository
from utils.division_utils import compute_divisions_and_pools
from utils.player_utils import (
    generate_player_birthdate,
    generate_player_build,
    generate_player_height,
    generate_player_name,
    generate_player_weight,
    generate_roster_positions,
)
from utils.schedule_utils import build_round_robin_schedule, compute_matchday_datetime

logger = logging.getLogger(__name__)

# A club's entry in one championship: (club_id, team number within the club).
Entry = tuple[int, int]

class SeasonGenerator:
    def run(self) -> None:
        logger.info("Starting season setup.")
        with connection.get_pool().connection() as conn, conn.cursor() as cursor:
            league_ids = team_repository.fetch_league_ids(cursor)

        for league_id in league_ids:
            with connection.get_pool().connection() as conn, conn.cursor() as cursor:
                done = team_repository.league_has_teams(cursor, league_id, SEASON_YEAR)
            if done:
                logger.info(f"League {league_id}: already set up for {SEASON_YEAR}, skipping.")
                continue
            self._setup_league(league_id)

        logger.info("Season setup complete.")

    # ------------------------------------------------------------------
    # League
    # ------------------------------------------------------------------

    def _setup_league(self, league_id: int) -> None:
        # One transaction for the whole league: a league with any team is skipped
        # on restart, so an interrupted setup must leave nothing behind.
        with connection.get_pool().connection() as conn:
            conn.autocommit = False
            try:
                with conn.cursor() as cursor:
                    clubs_by_committee = {
                        committee_id: team_repository.fetch_club_ids_for_committee(cursor, committee_id)
                        for committee_id in team_repository.fetch_committee_ids_for_league(cursor, league_id)
                    }
                    for gender in GENDERS:
                        for category in CATEGORIES:
                            regional: list[Entry] = []
                            for committee_id, club_ids in clubs_by_committee.items():
                                if not club_ids:
                                    logger.warning(f"Committee {committee_id}: no clubs found, skipping.")
                                    continue
                                departmental, promoted = self._split_80_20(self._draw_entries(club_ids))
                                self._create_championships(cursor, departmental, category, gender, "departmental")
                                regional.extend(promoted)
                            self._create_championships(cursor, regional, category, gender, "regional")
                conn.commit()
                logger.info(f"League {league_id}: championships, teams and schedule committed.")

            except Exception:
                conn.rollback()
                logger.exception(f"League {league_id}: setup failed, rolled back.")
                raise

    # ------------------------------------------------------------------
    # Entries
    # ------------------------------------------------------------------

    def _draw_entries(self, club_ids: list[int]) -> list[Entry]:
        """
        Draws a committee's entries for one gender and category: slightly more
        than one per club, so some clubs field several teams, numbered from 1.
        """
        num_entries = math.ceil(len(club_ids) + math.sqrt(len(club_ids)))
        club_team_count: dict[int, int] = dict.fromkeys(club_ids, 0)
        entries: list[Entry] = []
        for _ in range(num_entries):
            club_id = random.choice(club_ids)  # noqa: S2245
            club_team_count[club_id] += 1
            entries.append((club_id, club_team_count[club_id]))
        return entries

    # ------------------------------------------------------------------
    # Championships, pools, teams
    # ------------------------------------------------------------------

    def _create_championships(
        self,
        cursor,
        entries: list[Entry],
        category: str,
        gender: str,
        level: str,
    ) -> None:
        teams_per_pool_per_division = compute_divisions_and_pools(len(entries))
        entries = list(entries)
        random.shuffle(entries)  # noqa: S2245

        position = 0
        for division, teams_per_pool in enumerate(teams_per_pool_per_division, start=1):
            championship_id = championship_repository.insert_championship(
                cursor,
                category=category,
                gender=gender,
                level=level,
                season_year=SEASON_YEAR,
                division=division,
            )
            for index, count in enumerate(teams_per_pool):
                pool_entries = entries[position : position + count]
                position += count
                pool_id = championship_repository.insert_pool(cursor, championship_id, chr(65 + index))
                team_ids = team_repository.insert_teams(
                    cursor, [(pool_id, club_id, number) for club_id, number in pool_entries]
                )
                self._generate_players(cursor, team_ids, gender, category)
                self._schedule_pool(cursor, pool_id, team_ids)

    def _generate_players(
        self,
        cursor,
        team_ids: list[int],
        gender: str,
        category: str,
        players_per_team: int = 12,
    ) -> None:
        rows = []
        for team_id in team_ids:
            positions = generate_roster_positions(players_per_team)
            for number, position in enumerate(positions, start=1):
                build = generate_player_build(position)
                rows.append((
                    generate_player_name(gender),
                    number,
                    position,
                    generate_player_height(category, gender, build),
                    generate_player_weight(category, gender, build),
                    generate_player_birthdate(category),
                    team_id,
                ))
        team_repository.insert_players(cursor, rows)

    # ------------------------------------------------------------------
    # Match schedule
    # ------------------------------------------------------------------

    def _schedule_pool(self, cursor, pool_id: int, team_ids: list[int]) -> None:
        """Inserts the pool's full round-robin schedule as match shells."""
        if len(team_ids) < 2:
            logger.warning(f"Pool {pool_id} has fewer than 2 teams, skipping schedule.")
            return

        match_rows: list[tuple] = []
        for matchday, pairs in enumerate(build_round_robin_schedule(team_ids), start=1):
            starts_at = compute_matchday_datetime(SEASON_START_WEEK, SEASON_START_YEAR, matchday, pool_id)
            for home_id, away_id in pairs:
                match_rows.append((matchday, starts_at, home_id, away_id))

        match_repository.insert_scheduled_matches_bulk(cursor, match_rows)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _split_80_20(self, entries: list[Entry]) -> tuple[list[Entry], list[Entry]]:
        """
        Split entries into ~80% departmental and ~20% regional.
        Only a club's first team (number 1) can go up to regional level.
        """
        always_departmental = [e for e in entries if e[1] > 1]
        candidates = [e for e in entries if e[1] == 1]

        num_regional = math.ceil(0.2 * len(entries))
        remaining_slots = len(entries) - num_regional - len(always_departmental)

        random.shuffle(candidates)  # noqa: S2245
        departmental = always_departmental + candidates[:remaining_slots]
        regional = candidates[remaining_slots:]

        return departmental, regional
