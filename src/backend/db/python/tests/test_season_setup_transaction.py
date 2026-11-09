"""
A league's season setup is one transaction.

A league that has any team in this season's championships is skipped on
restart, so anything committed before the end would leave that league half set
up for good. And setup runs before the scheduler starts polling, so no match
would be generated.
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
    repository = season_generator.team_repository
    monkeypatch.setattr(repository, "fetch_committee_ids_for_league", lambda _cursor, _league: [1])
    monkeypatch.setattr(repository, "fetch_club_ids_for_committee", lambda _cursor, _committee: [1, 2, 3])
    monkeypatch.setattr(season_generator.SeasonGenerator, "_create_championships", calls._create_championships)
    return calls


def test_the_only_commit_comes_after_the_last_championship(season_generator, steps):
    season_generator.SeasonGenerator()._setup_league(1)

    names = [call[0] for call in steps.mock_calls]
    assert names.count("conn.commit") == 1
    last_championship = len(names) - 1 - names[::-1].index("_create_championships")
    assert last_championship < names.index("conn.commit")


@pytest.mark.parametrize("failing_call", [1, 20])
def test_a_failure_anywhere_commits_nothing(season_generator, steps, failing_call):
    calls = 0

    def create(*_args):
        nonlocal calls
        calls += 1
        if calls == failing_call:
            raise RuntimeError("interrupted")

    steps._create_championships.side_effect = create

    generator = season_generator.SeasonGenerator()
    with pytest.raises(RuntimeError):
        generator._setup_league(1)

    steps.conn.commit.assert_not_called()
    steps.conn.rollback.assert_called_once()
