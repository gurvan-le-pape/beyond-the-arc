-- Drops what nothing reads: the gyms table and the link to it, club websites,
-- which the FFBB import never filled, and team colours, which the scheduler
-- never wrote.
--
-- 1_seed_static_data still inserts gyms on a fresh database; this migration
-- removes them right after.
BEGIN;

ALTER TABLE "clubs" DROP COLUMN "gym_id", DROP COLUMN "website";
DROP TABLE "gyms";
ALTER TABLE "teams" DROP COLUMN "color";

COMMIT;
