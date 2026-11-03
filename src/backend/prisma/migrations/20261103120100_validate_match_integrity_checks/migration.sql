-- Validates the rules added NOT VALID by 20261103120000_match_integrity_checks
-- against the existing rows. VALIDATE CONSTRAINT takes SHARE UPDATE EXCLUSIVE,
-- so the scheduler and the API keep reading and writing during the scan.
--
-- A row that breaks a rule fails this migration, and with it the deploy; the
-- rules above stay enforced for new writes either way.

ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_status_check";
ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_scores_paired";
ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_result_iff_completed";
ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_scores_non_negative";
ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_flags_need_result";
ALTER TABLE "matches" VALIDATE CONSTRAINT "matches_distinct_teams";

ALTER TABLE "leaderboards" VALIDATE CONSTRAINT "leaderboards_counters_non_negative";
ALTER TABLE "leaderboards" VALIDATE CONSTRAINT "leaderboards_games_add_up";
ALTER TABLE "leaderboards" VALIDATE CONSTRAINT "leaderboards_difference_matches";
