import math
import random

from utils.db_utils import get_connection, release_connection
from utils.championship_utils import insert_championship
from utils.pool_utils import insert_pool
from utils.division_utils import compute_divisions_and_pools
from config import SEASON_YEAR, CATEGORIES, GENDERS

def generate_teams_for_committee(cursor, committee_id, club_ids):
    """
    Generate teams (and players) for a given committee.
    All inserts are batched — caller commits.
    """
    if not club_ids:
        print(f"Committee {committee_id}: No clubs found. Skipping.")
        return

    num_clubs = len(club_ids)
    num_teams_per_gender_category = math.ceil(num_clubs + math.sqrt(num_clubs))

    club_team_count = dict.fromkeys(club_ids, 0)
    insert_data = []

    for gender in GENDERS:
        for category in CATEGORIES:
            for _ in range(num_teams_per_gender_category):
                club_id = random.choice(club_ids)  # noqa: S2245 - simulation only
                club_team_count[club_id] += 1
                insert_data.append((club_id, category, gender, club_team_count[club_id]))

    cursor.executemany(
        """
        INSERT INTO teams (club_id, category, gender, number, pool_id)
        VALUES (%s, %s, %s, %s, NULL);
        """,
        insert_data,
    )

    # Retrieve all newly inserted team IDs for this committee's clubs
    cursor.execute(
        """
        SELECT id FROM teams WHERE club_id = ANY(%s);
        """,
        (club_ids,),
    )
    team_ids = [row[0] for row in cursor.fetchall()]

    # Batch generate players for all teams at once
    generate_players_for_teams(cursor, team_ids)

    print(f"Committee {committee_id}: Inserted teams and players for {len(club_ids)} clubs.")


def generate_players_for_teams(cursor, team_ids, num_players=12):
    """Batch insert players for a list of team IDs."""
    insert_data = [
        (f"Player {number}", number, team_id)
        for team_id in team_ids
        for number in range(1, num_players + 1)
    ]
    cursor.executemany(
        """
        INSERT INTO players (name, number, team_id)
        VALUES (%s, %s, %s)
        ON CONFLICT (team_id, number) DO NOTHING;
        """,
        insert_data,
    )


def perform_80_20_separation(teams):
    """
    Separate teams into ~80% committee-level and ~20% league-level.
    Teams with number > 1 are always assigned to committee level.
    Only first-number teams (number == 1) are candidates for league level.
    """
    committee_teams = [team[0] for team in teams if team[2] > 1]
    league_candidates = [team for team in teams if team[2] == 1]

    total_teams = len(teams)
    num_league_teams = math.ceil(0.2 * total_teams)
    num_committee_teams = total_teams - num_league_teams

    random.shuffle(league_candidates)  # noqa: S2245 - simulation only
    remaining_committee_slots = num_committee_teams - len(committee_teams)
    committee_teams += [team[0] for team in league_candidates[:remaining_committee_slots]]
    league_teams = [team[0] for team in league_candidates[remaining_committee_slots:]]

    return committee_teams, league_teams


def create_championship_and_pools(cursor, teams, division_index, championship_name, category, gender, level, committee_id=None, league_id=None, num_pools=0, teams_per_pool=None):
    """
    Create a championship and its pools, then assign teams to pools.
    All inserts are batched — caller commits.
    """
    if teams_per_pool is None:
        teams_per_pool = []

    division_name = f"{championship_name} - Division {division_index}"
    championship_id = insert_championship(
        cursor,
        name=division_name,
        category=category,
        gender=gender,
        level=level,
        season_year=SEASON_YEAR,
        division=str(division_index),
        committee_id=committee_id,
        league_id=league_id,
    )

    pool_ids = []
    for i in range(num_pools):
        letter = chr(65 + i)  # A, B, C, ...
        pool_id = insert_pool(cursor, championship_id, letter, f"Pool {letter}")
        pool_ids.append(pool_id)

    assign_teams_to_pools(cursor, teams, pool_ids, teams_per_pool)
    print(f"Created championship '{division_name}' with {num_pools} pool(s).")


def assign_teams_to_pools(cursor, teams, pool_ids, teams_per_pool):
    """Assign teams to pools via bulk update."""
    update_data = []
    start_index = 0
    for pool_index, pool_id in enumerate(pool_ids):
        slice_end = start_index + teams_per_pool[pool_index]
        for team_id in teams[start_index:slice_end]:
            update_data.append((pool_id, team_id))
        start_index = slice_end

    cursor.executemany(
        "UPDATE teams SET pool_id = %s WHERE id = %s;",
        update_data,
    )


def process_committee_teams(cursor, gender, category, league_id, committee_id):
    """
    For a single committee: split teams 80/20 between committee and league level,
    create committee-level championships, and return the league-level team IDs.
    """
    cursor.execute(
        """
        SELECT teams.id, teams.club_id, teams.number
        FROM teams
        JOIN clubs ON teams.club_id = clubs.id
        WHERE clubs.committee_id = %s AND teams.gender = %s AND teams.category = %s;
        """,
        (committee_id, gender, category),
    )
    teams = cursor.fetchall()

    if not teams:
        return []

    committee_teams, league_teams = perform_80_20_separation(teams)

    if committee_teams:
        pools_per_division, teams_per_pool_per_division = compute_divisions_and_pools(len(committee_teams))
        start_index = 0

        for division_index, (num_pools_in_division, teams_per_pool_list) in enumerate(
            zip(pools_per_division, teams_per_pool_per_division), start=1
        ):
            total_in_division = sum(teams_per_pool_list)
            division_teams = committee_teams[start_index:start_index + total_in_division]
            start_index += total_in_division

            create_championship_and_pools(
                cursor=cursor,
                teams=division_teams,
                division_index=division_index,
                championship_name=f"Committee {gender} {category}",
                category=category,
                gender=gender,
                level="departmental",
                committee_id=committee_id,
                league_id=league_id,
                num_pools=num_pools_in_division,
                teams_per_pool=teams_per_pool_list,
            )

    return league_teams


def process_league_teams(cursor, gender, category, league_id, all_league_teams):
    """Create league-level championships and assign the league-level teams."""
    if not all_league_teams:
        return

    pools_per_division, teams_per_pool_per_division = compute_divisions_and_pools(len(all_league_teams))
    start_index = 0

    for division_index, (num_pools_in_division, teams_per_pool_list) in enumerate(
        zip(pools_per_division, teams_per_pool_per_division), start=1
    ):
        total_in_division = sum(teams_per_pool_list)
        division_teams = all_league_teams[start_index:start_index + total_in_division]
        start_index += total_in_division

        create_championship_and_pools(
            cursor=cursor,
            teams=division_teams,
            division_index=division_index,
            championship_name=f"League {gender} {category}",
            category=category,
            gender=gender,
            level="regional",
            league_id=league_id,
            num_pools=num_pools_in_division,
            teams_per_pool=teams_per_pool_list,
        )


def main():
    conn = get_connection()
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM leagues;")
        leagues = cursor.fetchall()

        for league_row in leagues:
            league_id = league_row[0]

            cursor.execute("SELECT id FROM committees WHERE league_id = %s;", (league_id,))
            committees = [row[0] for row in cursor.fetchall()]

            # Generate teams for all clubs in all committees of this league (once, not per gender/category)
            for committee_id in committees:
                cursor.execute("SELECT id FROM clubs WHERE committee_id = %s;", (committee_id,))
                club_ids = [row[0] for row in cursor.fetchall()]
                generate_teams_for_committee(cursor, committee_id, club_ids)

            # Commit team + player generation before assigning to pools
            conn.commit()

            # Now assign teams to championships/pools per gender and category
            for gender in GENDERS:
                for category in CATEGORIES:
                    all_league_teams = []

                    for committee_id in committees:
                        league_teams = process_committee_teams(cursor, gender, category, league_id, committee_id)
                        all_league_teams.extend(league_teams)

                    process_league_teams(cursor, gender, category, league_id, all_league_teams)

            # Commit all championship/pool assignments for this league at once
            conn.commit()
            print(f"League {league_id}: All championships and pools committed.")

    except Exception as e:
        print(f"Error in generate_teams main: {e}")
        conn.rollback()
        raise
    finally:
        release_connection(conn)


if __name__ == "__main__":
    main()