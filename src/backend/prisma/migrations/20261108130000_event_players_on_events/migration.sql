-- An event's players move onto the event: player_id for its main player,
-- other_player_id for the other, by the roles its type names (EVENT_PLAYER_ROLES
-- in db/python/event_rules.py, read by the backend from common/constants).
-- `starter` rows are not carried over: nothing reads them. One transaction, so
-- the copy and the drop land together.
BEGIN;

ALTER TABLE "match_events"
ADD COLUMN "player_id" INTEGER,
ADD COLUMN "other_player_id" INTEGER;

CREATE TEMPORARY TABLE "event_player_roles" ("event_type", "main_role", "other_role") ON COMMIT DROP AS
VALUES
    ('tip_off', 'winner', NULL),
    ('traveling', 'shooter', NULL),
    ('carrying', 'shooter', NULL),
    ('double_dribble', 'shooter', NULL),
    ('bad_pass', 'shooter', NULL),
    ('steal', 'stealer', 'victim'),
    ('shot_clock_violation', 'shooter', NULL),
    ('offensive_foul', 'fouler', 'victim'),
    ('quarter_end', NULL, NULL),
    ('blocking_foul', 'fouler', 'victim'),
    ('pushing_foul', 'fouler', 'victim'),
    ('reaching_foul', 'fouler', 'victim'),
    ('charging_foul', 'fouler', 'victim'),
    ('illegal_screen', 'fouler', 'victim'),
    ('technical_foul', 'fouler', NULL),
    ('made_layup', 'shooter', 'assister'),
    ('made_dunk', 'shooter', 'assister'),
    ('made_fadeaway', 'shooter', 'assister'),
    ('made_pull_up_jump_shot', 'shooter', 'assister'),
    ('made_catch_and_shoot_three', 'shooter', 'assister'),
    ('made_step_back_three', 'shooter', 'assister'),
    ('missed_layup', 'shooter', NULL),
    ('missed_dunk', 'shooter', NULL),
    ('missed_fadeaway', 'shooter', NULL),
    ('missed_pull_up_jump_shot', 'shooter', NULL),
    ('missed_catch_and_shoot_three', 'shooter', NULL),
    ('missed_step_back_three', 'shooter', NULL),
    ('blocked_shot', 'blocked', 'blocker'),
    ('offensive_rebound', 'rebounder', NULL),
    ('defensive_rebound', 'rebounder', NULL),
    ('free_throw_made', 'shooter', NULL),
    ('free_throw_missed', 'shooter', NULL),
    ('3_point_shooting_foul', 'shooter', 'fouler'),
    ('2_point_ext_shooting_foul', 'shooter', 'fouler'),
    ('2_point_int_shooting_foul', 'shooter', 'fouler'),
    ('3_point_and_1', 'shooter', 'fouler'),
    ('2_point_ext_and_1', 'shooter', 'fouler'),
    ('2_point_int_and_1', 'shooter', 'fouler'),
    ('inbound', 'shooter', NULL),
    ('substitution', 'exiting_player', 'entering_player');

UPDATE "match_events" AS e
SET "player_id" = p."player_id"
FROM "match_event_players" AS p, "event_player_roles" AS r
WHERE p."event_id" = e."id" AND r."event_type" = e."event_type" AND p."role" = r."main_role";

UPDATE "match_events" AS e
SET "other_player_id" = p."player_id"
FROM "match_event_players" AS p, "event_player_roles" AS r
WHERE p."event_id" = e."id" AND r."event_type" = e."event_type" AND p."role" = r."other_role";

DROP TABLE "match_event_players";

ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_other_player_id_fkey" FOREIGN KEY ("other_player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "match_events" ADD CONSTRAINT "match_events_other_needs_player"
CHECK ("other_player_id" IS NULL OR "player_id" IS NOT NULL);

-- Shot charts read a player's (or a team's players') shots.
CREATE INDEX "idx_match_events_player_id_shots" ON "match_events" ("player_id") WHERE "shot_x" IS NOT NULL;

COMMIT;
