-- Integrity rules for matches and their standings, checked by the database
-- rather than assumed of the scheduler.
--
-- Added NOT VALID: each ADD takes its lock for an instant and enforces the rule
-- on every write from here on. The next migration validates the existing rows,
-- under a lock that lets reads and writes through; in this file the ACCESS
-- EXCLUSIVE lock of the ADDs would be held for the whole scan.

-- Championships: `check_level` requires committee_id/league_id at their level,
-- so SET NULL could never succeed. RESTRICT says why the delete is refused.
ALTER TABLE "championships" DROP CONSTRAINT "championships_committee_id_fkey";
ALTER TABLE "championships" DROP CONSTRAINT "championships_league_id_fkey";
ALTER TABLE "championships" ADD CONSTRAINT "championships_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "championships" ADD CONSTRAINT "championships_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- The scheduler's lifecycle (db/python/db/repositories/match_repository.py).
-- The leaderboard triggers compare against 'completed', so any other spelling
-- would leave the standings untouched without an error.
ALTER TABLE "matches" ADD CONSTRAINT "matches_status_check"
    CHECK (status IN ('scheduled', 'generating', 'completed', 'failed')) NOT VALID;

-- A result is both scores, and only a completed match has one.
ALTER TABLE "matches" ADD CONSTRAINT "matches_scores_paired"
    CHECK ((home_team_score IS NULL) = (away_team_score IS NULL)) NOT VALID;
ALTER TABLE "matches" ADD CONSTRAINT "matches_result_iff_completed"
    CHECK ((status = 'completed') = (home_team_score IS NOT NULL)) NOT VALID;
ALTER TABLE "matches" ADD CONSTRAINT "matches_scores_non_negative"
    CHECK (home_team_score >= 0 AND away_team_score >= 0) NOT VALID;
ALTER TABLE "matches" ADD CONSTRAINT "matches_flags_need_result"
    CHECK (status = 'completed' OR NOT (forfeit OR overtime)) NOT VALID;

ALTER TABLE "matches" ADD CONSTRAINT "matches_distinct_teams"
    CHECK (home_team_id <> away_team_id) NOT VALID;

-- Standings are written only by the triggers; these rules catch a trigger that
-- miscounts instead of storing its result.
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_counters_non_negative"
    CHECK (points >= 0 AND games_played >= 0 AND games_won >= 0 AND games_lost >= 0
       AND games_forfeited >= 0 AND points_for >= 0 AND points_against >= 0) NOT VALID;
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_games_add_up"
    CHECK (games_played = games_won + games_lost + games_forfeited) NOT VALID;
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_difference_matches"
    CHECK (point_difference = points_for - points_against) NOT VALID;
