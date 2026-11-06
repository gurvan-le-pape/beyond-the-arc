"""
A league's season setup is one transaction, its checkpoint included.

A retry inserts the league's teams again, and `teams` has a unique constraint,
so anything committed before the checkpoint would fail every later restart. And
setup runs before the scheduler starts polling, so no match would be generated.
"""

from unittest.mock import MagicMock

import pytest


@pytest.fixture
def season_generator(monkeypatch):
    # db.connection reads DATABASE_URL on import. Nothing here connects to it.
    monkeypatch.setenv("DATABASE_URL", "postgresql://unused")
    from generation import season_generator as module

    return module


@pytest.fixture
def steps(season_generator, monkeypatch):
    """The connection and the setup steps, recorded in the order they are called."""
    calls = MagicMock()
    pool = MagicMock()
    pool.connection.return_value.__enter__.return_value = calls.conn
    monkeypatch.setattr(season_generator.connection, "get_pool", lambda: pool)
    monkeypatch.setattr(season_generator.checkpoints, "mark_done", calls.mark_done)
    monkeypatch.setattr(
        season_generator.team_repository, "fetch_committee_ids_for_league", lambda _cursor, _league: [1]
    )
    generator = season_generator.SeasonGenerator
    for name in ("_generate_teams_and_players", "_setup_league_championships", "_build_match_schedule"):
        monkeypatch.setattr(generator, name, getattr(calls, name))
    calls._setup_committee_championships.return_value = []
    monkeypatch.setattr(generator, "_setup_committee_championships", calls._setup_committee_championships)
    return calls


def test_the_only_commit_comes_after_the_checkpoint(season_generator, steps):
    season_generator.SeasonGenerator()._setup_league(1, "league_setup")

    names = [call[0] for call in steps.mock_calls]
    assert names.count("conn.commit") == 1
    assert names.index("mark_done") < names.index("conn.commit")


@pytest.mark.parametrize("failing_step", ["_setup_league_championships", "_build_match_schedule", "mark_done"])
def test_a_failure_anywhere_commits_nothing(season_generator, steps, failing_step):
    getattr(steps, failing_step).side_effect = RuntimeError("interrupted")

    with pytest.raises(RuntimeError):
        season_generator.SeasonGenerator()._setup_league(1, "league_setup")

    steps.conn.commit.assert_not_called()
    steps.conn.rollback.assert_called_once()
