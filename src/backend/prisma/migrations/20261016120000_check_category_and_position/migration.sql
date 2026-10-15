-- Enum guards for the three string columns the API casts to a closed type
-- (`Category`, `Position` in common/constants) without a database guarantee.
-- The value lists match those constants.
--
-- Each ADD scans its table under ACCESS EXCLUSIVE. players is the largest
-- (~720k rows of a two-character column), a scan of well under a second; the
-- scheduler's writes wait for it rather than fail.

ALTER TABLE "championships" ADD CONSTRAINT "championships_category_check"
    CHECK (category IN ('U11', 'U13', 'U15', 'U18', 'U21', 'Seniors'));

ALTER TABLE "teams" ADD CONSTRAINT "teams_category_check"
    CHECK (category IN ('U11', 'U13', 'U15', 'U18', 'U21', 'Seniors'));

ALTER TABLE "players" ADD CONSTRAINT "players_position_check"
    CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C'));
