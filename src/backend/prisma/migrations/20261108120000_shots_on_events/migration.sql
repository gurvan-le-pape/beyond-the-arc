-- A shot's location moves onto its event, and the simulator's English
-- description goes: the frontend builds its own sentence from the event type
-- and the players' roles. One transaction, so the copy and the drops land
-- together.
BEGIN;

ALTER TABLE "match_events"
ADD COLUMN "shot_x" DECIMAL(5,2),
ADD COLUMN "shot_y" DECIMAL(5,2);

UPDATE "match_events" AS e
SET "shot_x" = s."x", "shot_y" = s."y"
FROM "shot_locations" AS s
WHERE s."id" = e."shot_location_id";

ALTER TABLE "match_events" ADD CONSTRAINT "match_events_shot_paired"
CHECK (("shot_x" IS NULL) = ("shot_y" IS NULL));

ALTER TABLE "match_events"
DROP COLUMN "shot_location_id",
DROP COLUMN "description";

DROP TABLE "shot_locations";

COMMIT;
