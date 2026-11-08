-- Removes the organiser links from championships. A championship's organiser is
-- found through its teams: pool, team, club, committee, league. The same links
-- were the only way the database could reject a duplicate championship, so
-- season setup now has to guarantee that itself.
BEGIN;

ALTER TABLE "championships" DROP CONSTRAINT "check_level";
DROP INDEX "unique_championship_no_committee";
DROP INDEX "championships_season_year_category_gender_level_division_co_key";
ALTER TABLE "championships"
  DROP COLUMN "committee_id",
  DROP COLUMN "league_id";

COMMIT;
