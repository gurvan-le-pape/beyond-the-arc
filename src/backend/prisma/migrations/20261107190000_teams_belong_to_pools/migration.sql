-- A team is created in its pool, and its category, gender and season are its
-- championship's. Season setup now skips a league that already has teams in
-- this season's championships, so seeding_checkpoints goes.
--
-- Deleting a pool that still has teams is refused. One transaction: a partial
-- run would leave pool_id nullable or the unique key missing.
BEGIN;

ALTER TABLE "teams" DROP CONSTRAINT "teams_pool_id_fkey";
DROP INDEX "idx_teams_pool_id";
DROP INDEX "teams_club_id_category_gender_number_season_year_key";

-- Also drops teams_category_check and teams_gender_check.
ALTER TABLE "teams" DROP COLUMN "category",
DROP COLUMN "gender",
DROP COLUMN "season_year",
ALTER COLUMN "pool_id" SET NOT NULL;

CREATE UNIQUE INDEX "teams_pool_id_club_id_number_key" ON "teams"("pool_id", "club_id", "number");
ALTER TABLE "teams" ADD CONSTRAINT "teams_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE "seeding_checkpoints";

COMMIT;
