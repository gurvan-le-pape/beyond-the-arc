"""Every match is played on a weekend, at one of the listed tip-off times."""

from utils.schedule_utils import PARIS, SLOT_OPTIONS, compute_matchday_datetime

SLOT_TIMES = {(hour, minute) for _, hour, minute in SLOT_OPTIONS}


def tip_offs():
    # 2026-2027 starts in ISO week 39 and runs 22 matchdays, across the
    # October and March DST changes and into the next year.
    for pool_id in range(1, 400):
        for matchday in range(1, 23):
            yield compute_matchday_datetime(39, 2026, matchday, pool_id).astimezone(PARIS)


def test_matches_are_played_on_saturday_or_sunday():
    days = {starts_at.strftime("%A") for starts_at in tip_offs()}
    assert days == {"Saturday", "Sunday"}


def test_tip_off_is_a_listed_local_time_on_both_sides_of_dst():
    assert {(starts_at.hour, starts_at.minute) for starts_at in tip_offs()} == SLOT_TIMES


def test_each_matchday_falls_in_its_own_week():
    weeks = [compute_matchday_datetime(39, 2026, matchday, 7).isocalendar()[1] for matchday in range(1, 23)]
    assert weeks == sorted(set(weeks), key=weeks.index)
    assert len(set(weeks)) == 22
