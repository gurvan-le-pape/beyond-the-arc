-- A match's per-player stat lines move onto the match: `box_score`, one JSON
-- object keyed by player id, written with the result (compute_box_score in the
-- scheduler) and read through parseBoxScore (common/utils/box-score.mapper.ts).
-- A completed match has one and no other match does, so the result rule now
-- covers it.
--
-- One transaction: `migrate deploy` commits each statement on its own, and the
-- stat lines must not be dropped unless they were all copied.
BEGIN;

ALTER TABLE "matches" ADD COLUMN "box_score" JSONB;

UPDATE "matches" m
SET "box_score" = lines.box_score
FROM (
    SELECT match_id,
           jsonb_object_agg(player_id::text, jsonb_build_object(
            'points', points,
            'fouls', fouls,
            'three_points_made', three_points_made,
            'three_points_attempted', three_points_attempted,
            'two_points_int_made', two_points_int_made,
            'two_points_int_attempted', two_points_int_attempted,
            'two_points_ext_made', two_points_ext_made,
            'two_points_ext_attempted', two_points_ext_attempted,
            'free_throws_made', free_throws_made,
            'free_throws_attempted', free_throws_attempted,
            'assists', assists,
            'turnovers', turnovers,
            'rebounds_offensive', rebounds_offensive,
            'rebounds_defensive', rebounds_defensive,
            'steals', steals,
            'blocks', blocks,
            'playtime_intervals', playtime_intervals
           )) AS box_score
    FROM "player_match_stats"
    GROUP BY match_id
) lines
WHERE m.id = lines.match_id;

-- A completed match in which no event named a player has no lines to copy.
UPDATE "matches" SET "box_score" = '{}' WHERE status = 'completed' AND box_score IS NULL;

DROP TABLE "player_match_stats";

ALTER TABLE "matches" DROP CONSTRAINT "matches_result_iff_completed";
ALTER TABLE "matches" ADD CONSTRAINT "matches_result_iff_completed"
    CHECK ((status = 'completed') = (home_team_score IS NOT NULL)
       AND (status = 'completed') = (box_score IS NOT NULL));
ALTER TABLE "matches" ADD CONSTRAINT "matches_box_score_is_object"
    CHECK (jsonb_typeof(box_score) = 'object');

COMMIT;
