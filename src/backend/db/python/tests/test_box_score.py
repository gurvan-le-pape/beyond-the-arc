"""The box score a match is saved with: its keys, entries and playtime."""

import json

from generation.match_generator import STAT_COLUMNS, compute_box_score

HOME, AWAY, BENCH = 1, 2, 3
PLAYTIMES = {HOME: [(0, 600), (900, 2400)], BENCH: [(600, 900)]}, {AWAY: [(0, 2400)]}


def test_each_player_named_by_an_event_has_an_entry_keyed_by_id_as_text():
    made = {"event_type": "made_layup", "player_roles": {"shooter": HOME, "assister": None}}
    rebound = {"event_type": "defensive_rebound", "player_roles": {"rebounder": AWAY}}

    box_score = compute_box_score(*PLAYTIMES, [made, rebound])

    assert set(box_score) == {"1", "2"}
    assert box_score["1"]["points"] == 2
    assert box_score["2"]["rebounds_defensive"] == 1


def test_an_entry_holds_every_counter_and_the_playtime_as_pairs():
    made = {"event_type": "made_layup", "player_roles": {"shooter": HOME}}

    entry = compute_box_score(*PLAYTIMES, [made])["1"]

    assert set(entry) == {*STAT_COLUMNS, "playtime_intervals"}
    assert entry["playtime_intervals"] == [[0, 600], [900, 2400]]


def test_the_box_score_is_json_as_it_is():
    made = {"event_type": "made_layup", "player_roles": {"shooter": HOME}}
    box_score = compute_box_score(*PLAYTIMES, [made])

    assert json.loads(json.dumps(box_score)) == box_score
