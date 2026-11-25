"""On SIGTERM the scheduler stops its workers and returns, so the process exits 0."""

import os
import signal
from unittest.mock import MagicMock

import pytest


@pytest.fixture
def module(monkeypatch):
    # db.connection reads DATABASE_URL on import. Nothing here connects to it.
    monkeypatch.setenv("DATABASE_URL", "postgresql://unused")
    import scheduler

    monkeypatch.setattr(scheduler, "ProcessPoolExecutor", MagicMock())
    previous = signal.getsignal(signal.SIGTERM)
    yield scheduler
    signal.signal(signal.SIGTERM, previous)


@pytest.fixture
def instance(module, monkeypatch):
    instance = module.Scheduler()
    monkeypatch.setattr(instance, "_recover_stuck_matches", lambda: None)
    monkeypatch.setattr(instance, "_ensure_season_setup", lambda: None)
    return instance


def send_sigterm(*_) -> None:
    os.kill(os.getpid(), signal.SIGTERM)


def test_sigterm_during_a_poll_lets_it_finish_then_cancels_the_queue(module, instance, monkeypatch):
    monkeypatch.setattr(instance, "_poll", send_sigterm)
    monkeypatch.setattr(module.time, "sleep", MagicMock(side_effect=AssertionError))

    instance.run()

    instance.executor.shutdown.assert_called_once_with(wait=True, cancel_futures=True)


def test_sigterm_between_polls_stops_the_wait(module, instance, monkeypatch):
    poll, sleep = MagicMock(), MagicMock(side_effect=send_sigterm)
    monkeypatch.setattr(instance, "_poll", poll)
    monkeypatch.setattr(module.time, "sleep", sleep)

    instance.run()

    poll.assert_called_once()
    sleep.assert_called_once_with(1)


def test_sigterm_during_startup_exits_at_once(module, instance, monkeypatch):
    exit_now = MagicMock(side_effect=SystemExit)
    monkeypatch.setattr(module.os, "_exit", exit_now)
    monkeypatch.setattr(instance, "_ensure_season_setup", send_sigterm)

    with pytest.raises(SystemExit):
        instance.run()

    exit_now.assert_called_once_with(0)
