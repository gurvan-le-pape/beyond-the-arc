-- Drops the leaderboards table, with the triggers and functions that kept it.
-- The backend computes standings from the teams and completed matches of a
-- pool, so the database no longer stores a copy of them.
BEGIN;

DROP TRIGGER match_leaderboard_trigger ON matches;
DROP TRIGGER team_pool_assignment_trigger ON teams;

DROP FUNCTION update_leaderboards_on_match_change();
DROP FUNCTION apply_match_result(matches, INT);
DROP FUNCTION apply_team_result(INT, INT, INT, INT, INT, INT, INT, INT, INT);
DROP FUNCTION initialize_leaderboard_on_team_pool_assignment();

DROP TABLE leaderboards;

COMMIT;
