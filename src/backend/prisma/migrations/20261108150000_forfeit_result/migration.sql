-- A forfeited match is not played: one side scores 20 and the other, the side
-- that forfeited, 0 (FORFEIT_SCORE in the scheduler's config.py). It has no
-- box-score lines either. The standings read the forfeiting side from the
-- score (computeStandings).
ALTER TABLE "matches" ADD CONSTRAINT "matches_forfeit_result"
    CHECK (NOT forfeit
        OR ((home_team_score, away_team_score) IN ((20, 0), (0, 20))
            AND box_score = '{}'::jsonb));
