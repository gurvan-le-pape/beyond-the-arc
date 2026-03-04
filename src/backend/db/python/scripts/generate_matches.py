from concurrent.futures import ThreadPoolExecutor
import os
import json
import random
from datetime import datetime, timedelta

from utils.db_utils import get_connection, release_connection
from match_simulator import MatchSimulator

script_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(script_dir, "game_config.json")

with open(config_path, "r") as config_file:
    game_config = json.load(config_file)

game_states = game_config["game_states"]
transition_events = game_config["transition_events"]


def generate_player_playtimes(cursor, team_id):
    """
    Generate player playtime intervals for a given team.
    Returns (player_playtimes, player_names, substitutions).
    """
    cursor.execute(
        "SELECT id, name FROM players WHERE team_id = %s;",
        (team_id,),
    )
    players_data = cursor.fetchall()
    if not players_data:
        return {}, {}, []

    players = [row[0] for row in players_data]
    player_names = {row[0]: row[1] for row in players_data}

    game_duration = 40 * 60  # seconds

    active_players = random.sample(players, min(5, len(players)))  # noqa: S2245
    bench_players = [p for p in players if p not in active_players]

    player_playtimes = {pid: [] for pid in players}
    substitutions = []

    for player in active_players:
        initial_duration = random.randint(300, 480)  # noqa: S2245
        player_playtimes[player].append((0, initial_duration))

    current_time = min(interval[1] for intervals in player_playtimes.values() for interval in intervals)

    while current_time < game_duration:
        exiting_player = next(
            pid for pid in active_players
            if player_playtimes[pid][-1][1] == current_time
        )

        if bench_players:
            entering_player = bench_players.pop(0)
            bench_players.append(exiting_player)

            substitutions.append({
                "time": current_time,
                "exiting_player": exiting_player,
                "entering_player": entering_player,
            })

            new_end = min(current_time + random.randint(300, 480), game_duration)  # noqa: S2245
            player_playtimes[entering_player].append((current_time, new_end))
            active_players[active_players.index(exiting_player)] = entering_player

        # Advance to next substitution event
        future_ends = [
            interval[1]
            for intervals in player_playtimes.values()
            for interval in intervals
            if interval[1] > current_time
        ]
        if not future_ends:
            break
        current_time = min(future_ends)

    return player_playtimes, player_names, substitutions


def process_pool_matches(pool_id, pool_name, match_date):
    """Generate and insert all matches for a single pool."""
    conn = get_connection()
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM teams WHERE pool_id = %s;", (pool_id,))
        teams = [row[0] for row in cursor.fetchall()]

        if not teams:
            print(f"Pool '{pool_name}': No teams found. Skipping.")
            return

        # Round-robin schedule (home + away legs)
        if len(teams) % 2 != 0:
            teams.append(None)

        num_teams = len(teams)
        half = num_teams // 2
        schedule = []

        for _ in range(num_teams - 1):
            round_matches = [
                (teams[i], teams[num_teams - i - 1])
                for i in range(half)
                if teams[i] is not None and teams[num_teams - i - 1] is not None
            ]
            schedule.append(round_matches)
            teams = [teams[0]] + [teams[-1]] + teams[1:-1]

        # Add return leg
        schedule += [[(away, home) for home, away in rnd] for rnd in schedule]

        match_simulator = MatchSimulator(game_states, transition_events)
        current_match_date = match_date

        for matchday, round_matches in enumerate(schedule, start=1):
            for home_team_id, away_team_id in round_matches:
                match_time = random.choice(["14:00", "16:00", "18:00", "20:00"])  # noqa: S2245
                match_datetime = datetime.combine(
                    current_match_date,
                    datetime.strptime(match_time, "%H:%M").time()
                )

                home_playtimes, home_names, home_subs = generate_player_playtimes(cursor, home_team_id)
                away_playtimes, away_names, away_subs = generate_player_playtimes(cursor, away_team_id)

                all_names = {**home_names, **away_names}
                all_subs = home_subs + away_subs

                match_events, home_score, away_score = match_simulator.simulate_match(
                    home_playtimes, away_playtimes, all_names, match_datetime
                )

                # Prevent draws
                if home_score == away_score:
                    home_score += 2
                    match_events.append({
                        "timestamp": match_datetime + timedelta(seconds=2400),
                        "player_roles": {"shooter": random.choice(list(home_playtimes.keys()))},  # noqa: S2245
                        "event_type": "made_layup",
                        "description": "Deciding basket.",
                    })

                # Insert match
                cursor.execute(
                    """
                    INSERT INTO matches (pool_id, matchday, date, home_team_id, away_team_id, home_team_score, away_team_score)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                    """,
                    (pool_id, matchday, match_datetime, home_team_id, away_team_id, home_score, away_score),
                )
                match_id = cursor.fetchone()[0]

                # Append substitution events
                for sub in all_subs:
                    exiting_name = all_names.get(sub["exiting_player"], f"Player {sub['exiting_player']}")
                    entering_name = all_names.get(sub["entering_player"], f"Player {sub['entering_player']}")
                    match_events.append({
                        "timestamp": match_datetime + timedelta(seconds=sub["time"]),
                        "event_type": "substitution",
                        "player_roles": {
                            "exiting_player": sub["exiting_player"],
                            "entering_player": sub["entering_player"],
                        },
                        "description": f"{entering_name} substitutes in for {exiting_name}.",
                    })

                match_events.sort(key=lambda e: e["timestamp"])

                # Bulk insert shot locations (deduplicated)
                shot_events = [e for e in match_events if e.get("shot_location")]
                shot_location_cache = {}

                if shot_events:
                    unique_coords = list({
                        (e["shot_location"]["x"], e["shot_location"]["y"])
                        for e in shot_events
                    })

                    # Fetch any already-existing locations
                    cursor.execute(
                        "SELECT id, x, y FROM shot_locations WHERE (x, y) = ANY(%s);",
                        (unique_coords,),
                    )
                    for row in cursor.fetchall():
                        shot_location_cache[(float(row[1]), float(row[2]))] = row[0]

                    # Insert missing ones
                    missing = [c for c in unique_coords if c not in shot_location_cache]
                    if missing:
                        cursor.executemany(
                            "INSERT INTO shot_locations (x, y) VALUES (%s, %s) RETURNING id;",
                            missing,
                        )
                        # executemany with RETURNING requires fetching one at a time in psycopg2
                        # Use a different approach: insert all and re-fetch
                        cursor.execute(
                            "SELECT id, x, y FROM shot_locations WHERE (x, y) = ANY(%s);",
                            (missing,),
                        )
                        for row in cursor.fetchall():
                            shot_location_cache[(float(row[1]), float(row[2]))] = row[0]

                # Bulk insert match events
                events_insert_data = []
                for event in match_events:
                    shot_location_id = None
                    if event.get("shot_location"):
                        key = (event["shot_location"]["x"], event["shot_location"]["y"])
                        shot_location_id = shot_location_cache.get(key)

                    events_insert_data.append((
                        match_id,
                        event["event_type"],
                        event["timestamp"].strftime("%Y-%m-%d %H:%M:%S.%f"),
                        event.get("description"),
                        shot_location_id,
                    ))

                cursor.executemany(
                    """
                    INSERT INTO match_events (match_id, event_type, timestamp, description, shot_location_id)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                    """,
                    events_insert_data,
                )
                # psycopg2 executemany doesn't return IDs — use a range fetch instead
                cursor.execute(
                    "SELECT id FROM match_events WHERE match_id = %s ORDER BY id;",
                    (match_id,),
                )
                event_ids = [row[0] for row in cursor.fetchall()]

                # Bulk insert match event players
                event_players_data = []
                for event_id, event in zip(event_ids, match_events):
                    for role, player_id in event.get("player_roles", {}).items():
                        if player_id is not None:
                            event_players_data.append((event_id, player_id, role))

                if event_players_data:
                    cursor.executemany(
                        "INSERT INTO match_event_players (event_id, player_id, role) VALUES (%s, %s, %s);",
                        event_players_data,
                    )

                # Generate and insert player stats
                insert_player_stats(cursor, match_id, home_playtimes, away_playtimes, match_events)

                # Insert playtime intervals
                insert_playtime_intervals(cursor, match_id, home_playtimes, away_playtimes)

                # Insert substitutions
                insert_substitutions(cursor, match_id, all_subs)

            current_match_date += timedelta(days=7)

        conn.commit()
        print(f"Pool '{pool_name}': All matches committed.")

    except Exception as e:
        print(f"Pool '{pool_name}': Error — {e}")
        conn.rollback()
    finally:
        release_connection(conn)


def insert_playtime_intervals(cursor, match_id, home_playtimes, away_playtimes):
    """Bulk insert player playtime intervals for a match."""
    data = []
    for player_id, intervals in {**home_playtimes, **away_playtimes}.items():
        for start, end in intervals:
            data.append((match_id, player_id, start, end))

    if data:
        cursor.executemany(
            """
            INSERT INTO player_playtime_intervals (match_id, player_id, start_time, end_time)
            VALUES (%s, %s, %s, %s);
            """,
            data,
        )


def insert_substitutions(cursor, match_id, substitutions):
    """Bulk insert substitution records for a match."""
    data = [
        (match_id, sub["time"], sub["exiting_player"], sub["entering_player"])
        for sub in substitutions
    ]
    if data:
        cursor.executemany(
            """
            INSERT INTO substitutions (match_id, timestamp, exiting_player_id, entering_player_id)
            VALUES (%s, %s, %s, %s);
            """,
            data,
        )


def insert_player_stats(cursor, match_id, home_playtimes, away_playtimes, match_events):
    """Compute and bulk insert player stats for a match."""
    all_playtimes = {**home_playtimes, **away_playtimes}

    # Aggregate stats from events
    player_stats = {}

    for event in match_events:
        event_type = event["event_type"]
        for role, player_id in event.get("player_roles", {}).items():
            if player_id is None:
                continue
            if player_id not in player_stats:
                player_stats[player_id] = {
                    "points": 0, "fouls": 0,
                    "three_points_made": 0, "three_points_attempted": 0,
                    "two_points_int_made": 0, "two_points_int_attempted": 0,
                    "two_points_ext_made": 0, "two_points_ext_attempted": 0,
                    "free_throws_made": 0, "free_throws_attempted": 0,
                    "assists": 0, "turnovers": 0,
                    "rebounds_offensive": 0, "rebounds_defensive": 0,
                    "steals": 0, "blocks": 0,
                }

            s = player_stats[player_id]

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

    # Build insert rows, joining with playtime intervals
    insert_data = []
    for player_id, stats in player_stats.items():
        intervals = all_playtimes.get(player_id, [])
        insert_data.append((
            match_id, player_id,
            stats["points"], stats["fouls"],
            stats["three_points_made"], stats["three_points_attempted"],
            stats["two_points_int_made"], stats["two_points_int_attempted"],
            stats["two_points_ext_made"], stats["two_points_ext_attempted"],
            stats["free_throws_made"], stats["free_throws_attempted"],
            stats["assists"], stats["turnovers"],
            stats["rebounds_offensive"], stats["rebounds_defensive"],
            stats["steals"], stats["blocks"],
            json.dumps(intervals),
        ))

    if insert_data:
        cursor.executemany(
            """
            INSERT INTO player_match_stats (
                match_id, player_id, points, fouls,
                three_points_made, three_points_attempted,
                two_points_int_made, two_points_int_attempted,
                two_points_ext_made, two_points_ext_attempted,
                free_throws_made, free_throws_attempted,
                assists, turnovers, rebounds_offensive, rebounds_defensive,
                steals, blocks, playtime_intervals
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (match_id, player_id) DO UPDATE SET
                points = EXCLUDED.points,
                fouls = EXCLUDED.fouls,
                three_points_made = EXCLUDED.three_points_made,
                three_points_attempted = EXCLUDED.three_points_attempted,
                two_points_int_made = EXCLUDED.two_points_int_made,
                two_points_int_attempted = EXCLUDED.two_points_int_attempted,
                two_points_ext_made = EXCLUDED.two_points_ext_made,
                two_points_ext_attempted = EXCLUDED.two_points_ext_attempted,
                free_throws_made = EXCLUDED.free_throws_made,
                free_throws_attempted = EXCLUDED.free_throws_attempted,
                assists = EXCLUDED.assists,
                turnovers = EXCLUDED.turnovers,
                rebounds_offensive = EXCLUDED.rebounds_offensive,
                rebounds_defensive = EXCLUDED.rebounds_defensive,
                steals = EXCLUDED.steals,
                blocks = EXCLUDED.blocks,
                playtime_intervals = EXCLUDED.playtime_intervals;
            """,
            insert_data,
        )


def main():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT pools.id, pools.name FROM pools JOIN championships ON pools.championship_id = championships.id;")
        pools = cursor.fetchall()
    finally:
        release_connection(conn)

    with ThreadPoolExecutor(max_workers=8) as executor:
        for pool_id, pool_name in pools:
            match_date = datetime(2025, 9, 6).date()  # First Saturday of the season
            executor.submit(process_pool_matches, pool_id, pool_name, match_date)


if __name__ == "__main__":
    main()