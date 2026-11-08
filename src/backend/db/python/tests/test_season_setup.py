"""
Season setup against in-memory repositories: every entry becomes exactly one
team, in exactly one pool of exactly one championship, and every pool gets its
full round-robin schedule.
"""

import random
from collections import Counter, defaultdict
from unittest.mock import MagicMock

import pytest

# Three committees: one small, one mid-sized, one large enough for several
# regional divisions once the league's three committees are pooled.
CLUBS = {1: list(range(1, 6)), 2: list(range(100, 141)), 3: list(range(200, 461))}
COMMITTEE_OF_CLUB = {club: committee for committee, clubs in CLUBS.items() for club in clubs}


@pytest.fixture
def season_generator(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://unused")
    from generation import season_generator as module

    return module


@pytest.fixture
def db(season_generator, monkeypatch):
    """In-memory tables, filled by the repository functions season setup calls."""
    tables = MagicMock()
    tables.championships = {}
    tables.pools = {}
    tables.teams = {}
    tables.players = []
    tables.matches = []
    tables.league_set_up = False

    def insert_championship(_cursor, **row):
        championship_id = len(tables.championships) + 1
        tables.championships[championship_id] = row
        return championship_id

    def insert_pool(_cursor, championship_id, letter):
        pool_id = len(tables.pools) + 1
        tables.pools[pool_id] = (championship_id, letter)
        return pool_id

    def insert_teams(_cursor, rows):
        ids = []
        for pool_id, club_id, number in rows:
            team_id = len(tables.teams) + 1
            tables.teams[team_id] = (pool_id, club_id, number)
            ids.append(team_id)
        tables.league_set_up = True
        return ids

    teams = season_generator.team_repository
    championships = season_generator.championship_repository
    monkeypatch.setattr(teams, "fetch_league_ids", lambda _cursor: [1])
    monkeypatch.setattr(teams, "league_has_teams", lambda _cursor, _league, _season: tables.league_set_up)
    monkeypatch.setattr(teams, "fetch_committee_ids_for_league", lambda _cursor, _league: list(CLUBS))
    monkeypatch.setattr(teams, "fetch_club_ids_for_committee", lambda _cursor, committee: CLUBS[committee])
    monkeypatch.setattr(teams, "insert_teams", insert_teams)
    monkeypatch.setattr(teams, "insert_players", lambda _cursor, rows: tables.players.extend(rows))
    monkeypatch.setattr(championships, "insert_championship", insert_championship)
    monkeypatch.setattr(championships, "insert_pool", insert_pool)
    monkeypatch.setattr(
        season_generator.match_repository,
        "insert_scheduled_matches_bulk",
        lambda _cursor, rows: tables.matches.extend(rows),
    )
    monkeypatch.setattr(season_generator.connection, "get_pool", lambda: MagicMock())
    random.seed(2026)
    season_generator.SeasonGenerator().run()
    return tables


def championship_of(db, team_id):
    pool_id = db.teams[team_id][0]
    return db.championships[db.pools[pool_id][0]]


def test_no_club_enters_one_championship_twice_under_one_number(db):
    entries = Counter(
        (club, number, c["gender"], c["category"])
        for team_id, (_, club, number) in db.teams.items()
        for c in [championship_of(db, team_id)]
    )
    assert max(entries.values()) == 1


def test_a_clubs_teams_are_numbered_from_one_without_gaps(db):
    numbers = defaultdict(set)
    for team_id, (_, club, number) in db.teams.items():
        c = championship_of(db, team_id)
        numbers[(club, c["gender"], c["category"])].add(number)
    assert all(found == set(range(1, len(found) + 1)) for found in numbers.values())


def test_championships_are_unique_per_organiser_level_and_division(db):
    organisers = defaultdict(set)
    for team_id, (_, club, _) in db.teams.items():
        c = championship_of(db, team_id)
        organisers[db.pools[db.teams[team_id][0]][0]].add(
            COMMITTEE_OF_CLUB[club] if c["level"] == "departmental" else "league"
        )
    # A departmental championship holds one committee's clubs.
    assert all(len(found) == 1 for found in organisers.values())
    keys = Counter(
        (organiser, c["level"], c["gender"], c["category"], c["division"])
        for championship_id, c in db.championships.items()
        for organiser in organisers[championship_id]
    )
    assert max(keys.values()) == 1


def test_only_first_teams_play_at_regional_level(db):
    regional = [
        number for team_id, (_, _, number) in db.teams.items() if championship_of(db, team_id)["level"] == "regional"
    ]
    assert regional and set(regional) == {1}


def test_pools_hold_at_most_twelve_teams_and_letters_are_unique(db):
    sizes = Counter(pool_id for pool_id, _, _ in db.teams.values())
    assert max(sizes.values()) <= 12
    assert set(sizes) == set(db.pools)
    assert len(set(db.pools.values())) == len(db.pools)


def test_every_pair_in_a_pool_meets_twice_once_at_each_home(db):
    pool_of = {team_id: pool_id for team_id, (pool_id, _, _) in db.teams.items()}
    fixtures = Counter((home, away) for _, _, home, away in db.matches)
    assert all(pool_of[home] == pool_of[away] for home, away in fixtures)
    assert max(fixtures.values()) == 1
    teams_in_pool = Counter(pool_of.values())
    expected = sum(n * (n - 1) for n in teams_in_pool.values())
    assert len(fixtures) == expected


def test_every_team_has_a_roster_of_twelve(db):
    rosters = Counter(row[-1] for row in db.players)
    assert set(rosters) == set(db.teams)
    assert set(rosters.values()) == {12}


def test_a_rerun_creates_nothing(season_generator, db):
    before = (len(db.championships), len(db.teams), len(db.matches))
    season_generator.SeasonGenerator().run()
    assert (len(db.championships), len(db.teams), len(db.matches)) == before
