"""
MatchGenerator

Simulates and persists a single match that has reached its scheduled_at time.
Called by the Scheduler for each due match.

Responsibilities:
  1. Load players for both teams
  2. Generate playtime intervals and substitutions
  3. Run MatchSimulator
  4. Persist all results: score, events, stats, intervals, substitutions
"""

import json
import logging
import random
from datetime import timedelta

from db.repositories import match_repository, team_repository
from db.repositories.match_repository import ScheduledMatch
from generation.playtime_generator import flatten_intervals, generate as generate_playtime
from simulation.match_simulator import MatchSimulator

logger = logging.getLogger(__name__)


class MatchGenerator:
    def __init__(self, simulator: MatchSimulator) -> None:
        self.simulator = simulator

    def generate(self, cursor, match: ScheduledMatch) -> None:
        """
        Simulate and persist a single match.
        Must be called within an open transaction — caller commits.
        """
        home_players = team_repository.fetch_players_for_team(cursor, match.home_team_id)
        away_players = team_repository.fetch_players_for_team(cursor, match.away_team_id)

        home_playtimes, home_names, home_subs = generate_playtime(home_players)
        away_playtimes, away_names, away_subs = generate_playtime(away_players)

        all_names = {**home_names, **away_names}
        all_subs = home_subs + away_subs

        match_events, home_score, away_score = self.simulator.simulate_match(
            home_playtimes, away_playtimes, all_names, match.scheduled_at
        )

        # Prevent draws
        if home_score == away_score:
            home_score += 2
            match_events.append({
                "timestamp": match.scheduled_at + timedelta(seconds=2401),
                "player_roles": {"shooter": random.choice(list(home_playtimes.keys()))},  # noqa: S2245
                "event_type": "made_layup",
                "description": "Deciding basket.",
            })

        overtime = any(
            e["timestamp"] > match.scheduled_at + timedelta(seconds=2400)
            for e in match_events
        )

        # Append substitution events before sorting
        for sub in all_subs:
            exiting_name = all_names.get(sub["exiting_player"], f"Player {sub['exiting_player']}")
            entering_name = all_names.get(sub["entering_player"], f"Player {sub['entering_player']}")
            match_events.append({
                "timestamp": match.scheduled_at + timedelta(seconds=sub["time"]),
                "event_type": "substitution",
                "player_roles": {
                    "exiting_player": sub["exiting_player"],
                    "entering_player": sub["entering_player"],
                },
                "description": f"{entering_name} substitutes in for {exiting_name}.",
            })

        match_events.sort(key=lambda e: e["timestamp"])

        # Persist result
        match_repository.update_match_result(
            cursor, match.id, home_score, away_score, overtime, forfeit=False
        )

        # Shot locations
        shot_coords = list({
            (e["shot_location"]["x"], e["shot_location"]["y"])
            for e in match_events
            if e.get("shot_location")
        })
        shot_cache = match_repository.insert_shot_locations_bulk(cursor, shot_coords)

        # Events
        event_ids = match_repository.insert_match_events_bulk(cursor, match.id, match_events, shot_cache)
        match_repository.insert_match_event_players_bulk(cursor, event_ids, match_events)

        # Stats
        stat_rows = self._compute_player_stats(home_playtimes, away_playtimes, match_events)
        match_repository.insert_player_stats_bulk(cursor, match.id, stat_rows)

        # Intervals and substitutions
        intervals = flatten_intervals(home_playtimes, away_playtimes)
        match_repository.insert_playtime_intervals_bulk(cursor, match.id, intervals)
        match_repository.insert_substitutions_bulk(cursor, match.id, all_subs)

        logger.info(f"Match {match.id}: generated ({home_score}–{away_score}).")

    # ------------------------------------------------------------------
    # Stats aggregation
    # ------------------------------------------------------------------

    def _compute_player_stats(
        self,
        home_playtimes: dict,
        away_playtimes: dict,
        match_events: list[dict],
    ) -> list[tuple]:
        """
        Aggregate stats from match events into per-player rows ready for DB insert.
        Returns list of tuples matching insert_player_stats_bulk's expected shape.
        """
        all_playtimes = {**home_playtimes, **away_playtimes}
        stats: dict[int, dict] = {}

        def get_or_create(pid: int) -> dict:
            if pid not in stats:
                stats[pid] = {
                    "points": 0, "fouls": 0,
                    "three_points_made": 0, "three_points_attempted": 0,
                    "two_points_int_made": 0, "two_points_int_attempted": 0,
                    "two_points_ext_made": 0, "two_points_ext_attempted": 0,
                    "free_throws_made": 0, "free_throws_attempted": 0,
                    "assists": 0, "turnovers": 0,
                    "rebounds_offensive": 0, "rebounds_defensive": 0,
                    "steals": 0, "blocks": 0,
                }
            return stats[pid]

        for event in match_events:
            event_type = event["event_type"]
            for role, player_id in event.get("player_roles", {}).items():
                if player_id is None:
                    continue
                s = get_or_create(player_id)

                if role == "shooter":
                    if event_type in ["made_catch_and_shoot_three", "made_step_back_three", "3_point_and_1"]:
                        s["points"] += 3
                        s["three_points_made"] += 1
                        s["three_points_attempted"] += 1
                    elif event_type in ["missed_catch_and_shoot_three", "missed_step_back_three"]:
                        s["three_points_attempted"] += 1
                    elif event_type in ["made_layup", "made_dunk", "2_point_int_and_1"]:
                        s["points"] += 2
                        s["two_points_int_made"] += 1
                        s["two_points_int_attempted"] += 1
                    elif event_type in ["missed_layup", "missed_dunk"]:
                        s["two_points_int_attempted"] += 1
                    elif event_type in ["made_fadeaway", "made_pull_up_jump_shot", "2_point_ext_and_1"]:
                        s["points"] += 2
                        s["two_points_ext_made"] += 1
                        s["two_points_ext_attempted"] += 1
                    elif event_type in ["missed_fadeaway", "missed_pull_up_jump_shot"]:
                        s["two_points_ext_attempted"] += 1
                    elif event_type == "free_throw_made":
                        s["points"] += 1
                        s["free_throws_made"] += 1
                        s["free_throws_attempted"] += 1
                    elif event_type == "free_throw_missed":
                        s["free_throws_attempted"] += 1
                    elif event_type in ["traveling", "carrying", "double_dribble", "bad_pass",
                                        "shot_clock_violation", "offensive_foul", "quarter_end"]:
                        s["turnovers"] += 1

                elif role == "fouler":
                    s["fouls"] += 1
                elif role == "rebounder":
                    if event_type == "offensive_rebound":
                        s["rebounds_offensive"] += 1
                    elif event_type == "defensive_rebound":
                        s["rebounds_defensive"] += 1
                elif role == "stealer":
                    s["steals"] += 1
                elif role == "assister":
                    s["assists"] += 1
                elif role == "victim":
                    s["turnovers"] += 1
                elif role == "blocker":
                    s["blocks"] += 1

        rows = []
        for player_id, s in stats.items():
            intervals = all_playtimes.get(player_id, [])
            rows.append((
                player_id,
                s["points"], s["fouls"],
                s["three_points_made"], s["three_points_attempted"],
                s["two_points_int_made"], s["two_points_int_attempted"],
                s["two_points_ext_made"], s["two_points_ext_attempted"],
                s["free_throws_made"], s["free_throws_attempted"],
                s["assists"], s["turnovers"],
                s["rebounds_offensive"], s["rebounds_defensive"],
                s["steals"], s["blocks"],
                json.dumps(intervals),
            ))

        return rows