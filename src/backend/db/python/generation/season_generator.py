"""
SeasonGenerator

Runs once at the start of a season. Idempotent — safe to restart if interrupted.
Checkpointed at the league level: if a league was fully committed, it is skipped on retry.

Responsibilities:
  1. For each league → committee → club: generate teams and players
  2. Split teams 80/20 between committee-level and league-level championships
  3. Create championships, divisions, pools
  4. Assign teams to pools
  5. Build the round-robin match schedule (empty match shells with scheduled_at)
"""

import logging
import math
import random

from config import CATEGORIES, GENDERS, SEASON_YEAR, SEASON_START_WEEK, SEASON_START_YEAR
from db import checkpoints, connection
from db.repositories import championship_repository, match_repository, team_repository
from utils.division_utils import compute_divisions_and_pools
from utils.player_utils import (
    generate_player_birthdate,
    generate_player_height,
    generate_player_name,
    generate_player_position,
    generate_player_weight,
)
from utils.schedule_utils import build_round_robin_schedule, compute_matchday_datetime

logger = logging.getLogger(__name__)


class SeasonGenerator:
    def run(self) -> None:
        logger.info("Starting season setup.")
        with connection.get_pool().connection() as conn:
            with conn.cursor() as cursor:
                league_ids = team_repository.fetch_league_ids(cursor)

        checkpoint_type = f"league_setup_{SEASON_YEAR}"
        for league_id in league_ids:
            if checkpoints.is_done(checkpoint_type, league_id):
                logger.info(f"League {league_id}: already set up for {SEASON_YEAR}, skipping.")
                continue
            self._setup_league(league_id, checkpoint_type)

        logger.info("Season setup complete.")

    # ------------------------------------------------------------------
    # League
    # ------------------------------------------------------------------

    def _setup_league(self, league_id: int, checkpoint_type: str) -> None:
        # get_pool().connection() is a context manager that:
        #   - commits automatically on clean exit (if autocommit=False, the default)
        #   - rolls back on exception
        #   - returns the connection cleanly with no open transaction
        # We manage commits manually here so we get two discrete checkpoints.
        with connection.get_pool().connection() as conn:
            conn.autocommit = False
            try:
                # Step 1: teams + players
                with conn.cursor() as cursor:
                    committee_ids = team_repository.fetch_committee_ids_for_league(cursor, league_id)
                    for committee_id in committee_ids:
                        self._generate_teams_and_players(cursor, committee_id)
                conn.commit()
                logger.info(f"League {league_id}: teams and players committed.")

                # Step 2: championships, pools, schedule
                with conn.cursor() as cursor:
                    for gender in GENDERS:
                        for category in CATEGORIES:
                            all_league_level_teams: list[int] = []
                            for committee_id in committee_ids:
                                league_level = self._setup_committee_championships(
                                    cursor, committee_id, gender, category, league_id
                                )
                                all_league_level_teams.extend(league_level)
                            self._setup_league_championships(
                                cursor, all_league_level_teams, gender, category, league_id
                            )
                    self._build_match_schedule(cursor, league_id)
                    checkpoints.mark_done(cursor, checkpoint_type, league_id)
                conn.commit()
                logger.info(f"League {league_id}: championships, pools, and schedule committed.")

            except Exception:
                conn.rollback()
                logger.exception(f"League {league_id}: setup failed, rolled back.")
                raise

    # ------------------------------------------------------------------
    # Teams and players
    # ------------------------------------------------------------------

    def _generate_teams_and_players(self, cursor, committee_id: int) -> None:
        club_ids = team_repository.fetch_club_ids_for_committee(cursor, committee_id)
        if not club_ids:
            logger.warning(f"Committee {committee_id}: no clubs found, skipping.")
            return

        num_teams_per_gender_category = math.ceil(len(club_ids) + math.sqrt(len(club_ids)))
        team_rows = []

        for gender in GENDERS:
            for category in CATEGORIES:
                club_team_count: dict[int, int] = dict.fromkeys(club_ids, 0)
                for _ in range(num_teams_per_gender_category):
                    club_id = random.choice(club_ids)  # noqa: S2245
                    club_team_count[club_id] += 1
                    team_rows.append((club_id, SEASON_YEAR, category, gender, club_team_count[club_id]))

        team_repository.insert_teams(cursor, team_rows)

        teams = team_repository.fetch_teams_for_clubs(cursor, club_ids, SEASON_YEAR)
        self._generate_players(cursor, teams)

        logger.debug(f"Committee {committee_id}: inserted teams and players for {len(club_ids)} clubs.")

    def _generate_players(
        self,
        cursor,
        teams: list[tuple[int, str, str]],
        players_per_team: int = 12,
    ) -> None:
        rows = [
            (
                generate_player_name(gender),
                number,
                generate_player_position(),
                generate_player_height(category, gender),
                generate_player_weight(category, gender),
                generate_player_birthdate(category),
                team_id,
            )
            for team_id, gender, category in teams
            for number in range(1, players_per_team + 1)
        ]
        team_repository.insert_players(cursor, rows)

    # ------------------------------------------------------------------
    # Championships and pools
    # ------------------------------------------------------------------

    def _setup_committee_championships(
        self,
        cursor,
        committee_id: int,
        gender: str,
        category: str,
        league_id: int,
    ) -> list[int]:
        """
        Split committee teams 80/20, create committee-level championships,
        and return the team IDs that go up to league level.
        """
        teams = team_repository.fetch_teams_for_committee(cursor, committee_id, gender, category, SEASON_YEAR)
        if not teams:
            return []

        committee_team_ids, league_team_ids = self._split_80_20(teams)

        if committee_team_ids:
            self._create_championships_and_pools(
                cursor=cursor,
                team_ids=committee_team_ids,
                championship_name=f"Committee {gender} {category}",
                category=category,
                gender=gender,
                level="departmental",
                committee_id=committee_id,
                league_id=league_id,
            )

        return league_team_ids

    def _setup_league_championships(
        self,
        cursor,
        team_ids: list[int],
        gender: str,
        category: str,
        league_id: int,
    ) -> None:
        if not team_ids:
            return
        self._create_championships_and_pools(
            cursor=cursor,
            team_ids=team_ids,
            championship_name=f"League {gender} {category}",
            category=category,
            gender=gender,
            level="regional",
            league_id=league_id,
        )

    def _create_championships_and_pools(
        self,
        cursor,
        team_ids: list[int],
        championship_name: str,
        category: str,
        gender: str,
        level: str,
        committee_id: int | None = None,
        league_id: int | None = None,
    ) -> None:
        pools_per_division, teams_per_pool_per_division = compute_divisions_and_pools(len(team_ids))
        random.shuffle(team_ids)  # noqa: S2245

        team_cursor = 0
        for division_index, (num_pools, teams_per_pool_list) in enumerate(
            zip(pools_per_division, teams_per_pool_per_division), start=1
        ):
            championship_id = championship_repository.insert_championship(
                cursor,
                name=f"{championship_name} - Division {division_index}",
                category=category,
                gender=gender,
                level=level,
                season_year=SEASON_YEAR,
                division=division_index,
                committee_id=committee_id,
                league_id=league_id,
            )

            # pool_cursor tracks position within team_ids for this division
            pool_cursor = team_cursor
            all_assignments: list[tuple[int, int]] = []

            for i in range(num_pools):
                pool_id = championship_repository.insert_pool(
                    cursor, championship_id, chr(65 + i), f"Pool {chr(65 + i)}"
                )
                count = teams_per_pool_list[i]
                assignments = [
                    (pool_id, team_ids[pool_cursor + j])
                    for j in range(count)
                    if pool_cursor + j < len(team_ids)
                ]
                all_assignments.extend(assignments)
                pool_cursor += count

            # One bulk UPDATE for all pools in this division
            team_repository.assign_teams_to_pool(cursor, all_assignments)

            # Advance the outer cursor past all teams consumed by this division
            team_cursor = pool_cursor

    # ------------------------------------------------------------------
    # Match schedule
    # ------------------------------------------------------------------

    def _build_match_schedule(self, cursor, league_id: int) -> None:
        """
        For every pool in this league, generate the full round-robin schedule
        and bulk-insert all match shells in a single call per pool.
        """
        # Scoped to this season only — without it, re-running setup for a new
        # season would also re-schedule already-completed pools from prior
        # seasons, using their old (fully played) teams.
        cursor.execute(
            """
            SELECT pools.id, pools.name
            FROM pools
            JOIN championships ON pools.championship_id = championships.id
            WHERE championships.season_year = %s
              AND (
                championships.league_id = %s
                OR championships.committee_id IN (
                    SELECT id FROM committees WHERE league_id = %s
                )
              );
            """,
            (SEASON_YEAR, league_id, league_id),
        )
        pools = cursor.fetchall()

        for pool_id, pool_name in pools:
            team_ids = team_repository.fetch_teams_for_pool(cursor, pool_id)
            if len(team_ids) < 2:
                logger.warning(f"Pool '{pool_name}' has fewer than 2 teams, skipping schedule.")
                continue

            schedule = build_round_robin_schedule(team_ids)

            match_rows: list[tuple] = []
            for matchday, pairs in enumerate(schedule, start=1):
                scheduled_at = compute_matchday_datetime(
                    SEASON_START_WEEK, SEASON_START_YEAR, matchday, pool_id
                )
                for home_id, away_id in pairs:
                    match_rows.append((pool_id, matchday, scheduled_at, home_id, away_id))

            if match_rows:
                match_repository.insert_scheduled_matches_bulk(cursor, match_rows)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _split_80_20(
        self,
        teams: list[tuple[int, int, int]],
    ) -> tuple[list[int], list[int]]:
        """
        Split teams into ~80% committee-level and ~20% league-level.
        Teams with number > 1 always stay at committee level.
        Only first-team entries (number == 1) are eligible for league level.
        """
        always_committee = [t[0] for t in teams if t[2] > 1]
        candidates = [t for t in teams if t[2] == 1]

        total = len(teams)
        num_league = math.ceil(0.2 * total)
        num_committee = total - num_league

        random.shuffle(candidates)  # noqa: S2245
        remaining_slots = num_committee - len(always_committee)
        committee_ids = always_committee + [t[0] for t in candidates[:remaining_slots]]
        league_ids = [t[0] for t in candidates[remaining_slots:]]

        return committee_ids, league_ids