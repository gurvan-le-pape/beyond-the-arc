"""
MatchGenerator

Simulates and persists a single match that has reached its starts_at time.
Called by the Scheduler for each due match.

Responsibilities:
  1. Load players for both teams
  2. Generate playtime rotations and substitutions
  3. Run MatchSimulator
  4. Persist all results: score, events (including substitutions and
     starters), and per-player stats (including playtime, derived from
     those same events)
"""

import json
import logging
import random
from dataclasses import dataclass
from datetime import datetime, timedelta

from db.repositories import match_repository, team_repository
from db.repositories.match_repository import ScheduledMatch
from event_rules import BALL_HANDLER_TURNOVERS, MADE_SHOTS, MISSED_SHOTS, SHOT_CATEGORY_STAT_PREFIX
from generation.playtime_generator import generate as generate_playtime
from simulation.match_simulator import MatchSimulator

logger = logging.getLogger(__name__)


@dataclass
class SimulatedMatch:
    """One simulated match, ready to persist. `stat_rows` follows insert_player_stats_bulk's row shape."""

    events: list[dict]
    home_score: int
    away_score: int
    overtime: bool
    stat_rows: list[tuple]


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

        result = self.simulate(home_players, away_players, match.starts_at)

        # Persist result
        match_repository.update_match_result(
            cursor, match.id, result.home_score, result.away_score, result.overtime, forfeit=False
        )

        # Shot locations
        shot_coords = list({
            (e["shot_location"]["x"], e["shot_location"]["y"])
            for e in result.events
            if e.get("shot_location")
        })
        shot_cache = match_repository.insert_shot_locations_bulk(cursor, shot_coords)

        # Events
        event_ids = match_repository.insert_match_events_bulk(cursor, match.id, result.events, shot_cache)
        match_repository.insert_match_event_players_bulk(cursor, event_ids, result.events)

        # Stats (including playtime, both derived from the events above)
        match_repository.insert_player_stats_bulk(cursor, match.id, result.stat_rows)

        logger.info(f"Match {match.id}: generated ({result.home_score}–{result.away_score}).")

    def simulate(
        self,
        home_players: list[tuple[int, str]],
        away_players: list[tuple[int, str]],
        starts_at: datetime,
    ) -> SimulatedMatch:
        """
        Simulate one match without touching the database: rotations, events,
        final score and the per-player stat rows derived from those events.
        """
        home_playtimes, home_names, home_subs = generate_playtime(home_players)
        away_playtimes, away_names, away_subs = generate_playtime(away_players)

        all_names = {**home_names, **away_names}
        all_subs = home_subs + away_subs

        match_events, home_score, away_score = self.simulator.simulate_match(
            home_playtimes, away_playtimes, all_names, starts_at
        )

        # Prevent draws
        if home_score == away_score:
            home_score += 2
            match_events.append({
                "occurred_at": starts_at + timedelta(seconds=2401),
                "player_roles": {"shooter": random.choice(list(home_playtimes.keys()))},  # noqa: S2245
                "event_type": "made_layup",
                "description": "Deciding basket.",
            })

        overtime = any(
            e["occurred_at"] > starts_at + timedelta(seconds=2400)
            for e in match_events
        )

        # Append substitution events before sorting
        for sub in all_subs:
            exiting_name = all_names.get(sub["exiting_player"], f"Player {sub['exiting_player']}")
            entering_name = all_names.get(sub["entering_player"], f"Player {sub['entering_player']}")
            match_events.append({
                "occurred_at": starts_at + timedelta(seconds=sub["time"]),
                "event_type": "substitution",
                "player_roles": {
                    "exiting_player": sub["exiting_player"],
                    "entering_player": sub["entering_player"],
                },
                "description": f"{entering_name} substitutes in for {exiting_name}.",
            })

        match_events.sort(key=lambda e: e["occurred_at"])

        return SimulatedMatch(
            events=match_events,
            home_score=home_score,
            away_score=away_score,
            overtime=overtime,
            stat_rows=compute_player_stats(home_playtimes, away_playtimes, match_events),
        )


# ------------------------------------------------------------------
# Stats aggregation
# ------------------------------------------------------------------

# Column order of a stat row, between the leading player id and the trailing
# playtime intervals — insert_player_stats_bulk's row shape.
STAT_COLUMNS = (
    "points", "fouls",
    "three_points_made", "three_points_attempted",
    "two_points_int_made", "two_points_int_attempted",
    "two_points_ext_made", "two_points_ext_attempted",
    "free_throws_made", "free_throws_attempted",
    "assists", "turnovers",
    "rebounds_offensive", "rebounds_defensive",
    "steals", "blocks",
)


def _tally_shooter(stats: dict[str, int], event_type: str) -> None:
    if event_type in MADE_SHOTS:
        category, shot_points = MADE_SHOTS[event_type]
        prefix = SHOT_CATEGORY_STAT_PREFIX[category]
        stats["points"] += shot_points
        stats[f"{prefix}_made"] += 1
        stats[f"{prefix}_attempted"] += 1
    elif event_type in MISSED_SHOTS:
        prefix = SHOT_CATEGORY_STAT_PREFIX[MISSED_SHOTS[event_type]]
        stats[f"{prefix}_attempted"] += 1
    elif event_type == "free_throw_made":
        stats["points"] += 1
        stats["free_throws_made"] += 1
        stats["free_throws_attempted"] += 1
    elif event_type == "free_throw_missed":
        stats["free_throws_attempted"] += 1
    elif event_type in BALL_HANDLER_TURNOVERS:
        stats["turnovers"] += 1


def _tally_rebounder(stats: dict[str, int], event_type: str) -> None:
    if event_type == "offensive_rebound":
        stats["rebounds_offensive"] += 1
    elif event_type == "defensive_rebound":
        stats["rebounds_defensive"] += 1


def _tally_victim(stats: dict[str, int], event_type: str) -> None:
    # The victim of a steal lost the ball; the victim of a foul did not.
    if event_type == "steal":
        stats["turnovers"] += 1


def _count(column: str):
    def tally(stats: dict[str, int], _event_type: str) -> None:
        stats[column] += 1
    return tally


# What each role in an event adds to that player's stat line. A role missing
# here (winner, the substitution roles) adds nothing, but still gives the
# player a row.
_ROLE_TALLIES = {
    "shooter": _tally_shooter,
    "fouler": _count("fouls"),
    "rebounder": _tally_rebounder,
    "stealer": _count("steals"),
    "assister": _count("assists"),
    "victim": _tally_victim,
    "blocked": _count("two_points_int_attempted"),
    "blocker": _count("blocks"),
}


def compute_player_stats(
    home_playtimes: dict,
    away_playtimes: dict,
    match_events: list[dict],
) -> list[tuple]:
    """
    Aggregate stats from match events into per-player rows ready for DB insert.
    Returns list of tuples matching insert_player_stats_bulk's expected shape.
    """
    all_playtimes = {**home_playtimes, **away_playtimes}
    stats: dict[int, dict[str, int]] = {}

    for event in match_events:
        for role, player_id in event.get("player_roles", {}).items():
            # `starter` only marks who was on court at tip-off; playtime comes
            # from the intervals, not from the events.
            if role == "starter" or player_id is None:
                continue
            player_stats = stats.setdefault(player_id, dict.fromkeys(STAT_COLUMNS, 0))
            tally = _ROLE_TALLIES.get(role)
            if tally:
                tally(player_stats, event["event_type"])

    return [
        (
            player_id,
            *(player_stats[column] for column in STAT_COLUMNS),
            json.dumps(all_playtimes.get(player_id, [])),
        )
        for player_id, player_stats in stats.items()
    ]
