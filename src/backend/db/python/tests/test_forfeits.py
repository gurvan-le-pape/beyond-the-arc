"""Forfeits: how often they are drawn, by whom, and what is saved for one."""

import math
import random
from datetime import UTC, datetime
from unittest.mock import MagicMock

import pytest

from config import FORFEIT_ODDS, FORFEIT_SCORE
from db.repositories.match_repository import ScheduledMatch
from generation import match_generator
from generation.match_generator import MatchGenerator, draw_forfeit

DRAWS = 200_000


@pytest.mark.parametrize("level", sorted(FORFEIT_ODDS))
def test_each_level_forfeits_at_its_odds(level):
    rng = random.Random(f"forfeits-{level}")
    odds = FORFEIT_ODDS[level]

    forfeits = sum(draw_forfeit(level, rng) is not None for _ in range(DRAWS))

    # Four standard errors: a fair draw fails this about once in 16,000 runs.
    tolerance = 4 * math.sqrt(odds * (1 - odds) / DRAWS)
    assert abs(forfeits / DRAWS - odds) < tolerance


def test_either_team_can_forfeit_equally_often():
    rng = random.Random("forfeit-sides")

    sides = [draw_forfeit("departmental", rng) for _ in range(DRAWS)]
    home, away = sides.count("home"), sides.count("away")

    total = home + away
    assert abs(home / total - 0.5) < 4 * math.sqrt(0.25 / total)


def test_an_unknown_level_is_an_error():
    rng = random.Random(0)
    with pytest.raises(KeyError):
        draw_forfeit("international", rng)


@pytest.mark.parametrize(("forfeiter", "score"), [("home", (0, FORFEIT_SCORE)), ("away", (FORFEIT_SCORE, 0))])
def test_a_forfeit_saves_the_score_and_nothing_else(monkeypatch, forfeiter, score):
    repository = MagicMock()
    monkeypatch.setattr(match_generator, "match_repository", repository)
    monkeypatch.setattr(match_generator, "team_repository", MagicMock())
    monkeypatch.setattr(match_generator, "draw_forfeit", lambda level: forfeiter)
    simulator = MagicMock()
    match = ScheduledMatch(7, 1, 1, 2, datetime(2026, 11, 8, tzinfo=UTC), "departmental")

    MatchGenerator(simulator).generate(MagicMock(), match)

    repository.update_match_result.assert_called_once()
    saved = repository.update_match_result.call_args
    assert saved.args[1:] == (7, *score)
    assert saved.kwargs == {"overtime": False, "forfeit": True, "box_score": {}}
    repository.insert_match_events_bulk.assert_not_called()
    simulator.simulate_match.assert_not_called()
