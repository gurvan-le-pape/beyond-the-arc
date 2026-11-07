-- Drops the championship and pool names. The scheduler built both from the
-- other columns of the same rows, and pages build their own localised titles.
BEGIN;

ALTER TABLE "championships" DROP COLUMN "name";
ALTER TABLE "pools" DROP COLUMN "name";

COMMIT;
