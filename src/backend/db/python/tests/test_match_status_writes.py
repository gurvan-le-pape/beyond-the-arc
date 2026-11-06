"""
Every write to a match's status names the status it expects.

A match can be handed back to `scheduled` by a restart while a worker is still
simulating it, so two runs of one match can overlap. The later one must not
replace the earlier one's result.
"""

from datetime import UTC, datetime
from unittest.mock import MagicMock

import pytest

from db.repositories import match_repository
from db.repositories.match_repository import ScheduledMatch


def cursor_updating(rows: int) -> MagicMock:
    cursor = MagicMock()
    cursor.rowcount = rows
    return cursor


def match(match_id: int = 7) -> ScheduledMatch:
    return ScheduledMatch(match_id, 1, 1, 1, 2, datetime(2026, 11, 6, tzinfo=UTC))


def test_a_transition_only_applies_from_the_expected_status():
    cursor = cursor_updating(1)

    assert match_repository.transition_match_status(cursor, 7, "scheduled", "generating")

    sql, params = cursor.execute.call_args.args
    assert "WHERE id = %s AND status = %s" in sql
    assert params == ("generating", 7, "scheduled")


def test_a_transition_reports_a_match_that_has_moved_on():
    assert not match_repository.transition_match_status(cursor_updating(0), 7, "generating", "failed")


def test_a_result_is_only_saved_on_a_generating_match():
    cursor = cursor_updating(1)

    match_repository.update_match_result(cursor, 7, 80, 70, False, False)

    assert "status = 'generating'" in cursor.execute.call_args.args[0]


def test_saving_a_result_on_a_match_that_has_moved_on_raises():
    with pytest.raises(RuntimeError, match="Match 7"):
        match_repository.update_match_result(cursor_updating(0), 7, 80, 70, False, False)


@pytest.fixture
def scheduler(monkeypatch):
    # db.connection reads DATABASE_URL on import. Nothing here connects to it.
    monkeypatch.setenv("DATABASE_URL", "postgresql://unused")
    import scheduler as module

    pool = MagicMock()
    monkeypatch.setattr(module.connection, "get_pool", lambda: pool)
    return module


def test_poll_dispatches_only_the_matches_it_moved_to_generating(scheduler, monkeypatch):
    monkeypatch.setattr(
        scheduler.match_repository, "fetch_due_matches", lambda _cursor: [match(1), match(2)]
    )
    monkeypatch.setattr(
        scheduler.match_repository,
        "transition_match_status",
        lambda _cursor, match_id, _expected, _new: match_id == 2,
    )
    instance = scheduler.Scheduler.__new__(scheduler.Scheduler)
    instance.executor = MagicMock()

    instance._poll()

    instance.executor.submit.assert_called_once()
    assert instance.executor.submit.call_args.args[1].id == 2


def test_a_failed_run_marks_only_a_generating_match_failed(scheduler, monkeypatch):
    transition = MagicMock(return_value=False)
    monkeypatch.setattr(scheduler.match_repository, "transition_match_status", transition)
    generator = MagicMock()
    generator.generate.side_effect = RuntimeError("Match 7 is not generating")
    monkeypatch.setattr(scheduler, "_match_generator", generator)

    scheduler._generate_worker(match())

    assert transition.call_args.args[1:] == (7, "generating", "failed")
