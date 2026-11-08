-- Moves each region onto its league and each department onto its committee,
-- then drops both tables. The pairs are one to one: 13 leagues to 13 regions,
-- 96 committees to 96 departments. The NOT NULL and UNIQUE constraints fail
-- the migration, and the transaction with it, if that stops being true.
--
-- A department's region is the region of its committee's league, so
-- departments.region_id is not carried over.
--
-- 1_seed_static_data still inserts into regions and departments on a fresh
-- database; this migration folds them in right after.
BEGIN;

ALTER TABLE "leagues"
  ADD COLUMN "region_code" VARCHAR(10),
  ADD COLUMN "region_name" VARCHAR(255);

UPDATE "leagues" l
SET "region_code" = r."code", "region_name" = r."name"
FROM "regions" r
WHERE r."id" = l."region_id";

ALTER TABLE "leagues"
  ALTER COLUMN "region_code" SET NOT NULL,
  ALTER COLUMN "region_name" SET NOT NULL,
  DROP COLUMN "region_id";

CREATE UNIQUE INDEX "leagues_region_code_key" ON "leagues"("region_code");

ALTER TABLE "committees"
  ADD COLUMN "department_code" VARCHAR(10),
  ADD COLUMN "department_name" VARCHAR(255);

UPDATE "committees" c
SET "department_code" = d."code", "department_name" = d."name"
FROM "departments" d
WHERE d."id" = c."department_id";

ALTER TABLE "committees"
  ALTER COLUMN "department_code" SET NOT NULL,
  ALTER COLUMN "department_name" SET NOT NULL,
  DROP COLUMN "department_id";

CREATE UNIQUE INDEX "committees_department_code_key" ON "committees"("department_code");

DROP TABLE "departments";
DROP TABLE "regions";

COMMIT;
