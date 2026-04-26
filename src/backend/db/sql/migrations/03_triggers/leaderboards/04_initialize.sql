CREATE OR REPLACE FUNCTION initialize_leaderboard_on_team_pool_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a zero-initialized leaderboard entry for the team assigned to the pool.
    -- ON CONFLICT DO NOTHING ensures existing entries with match results are never overwritten.
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,  -- Pool ID from the updated team row
        NEW.id,       -- Team ID from the updated team row
        0,            -- games_played
        0,            -- games_won
        0,            -- games_lost
        0,            -- games_forfeited
        0,            -- points_for
        0,            -- points_against
        0,            -- point_difference
        0             -- points
    )
    ON CONFLICT (pool_id, team_id) DO NOTHING; -- Preserve existing entries

    RETURN NEW; -- Return the updated team row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
-- Fires after a team's pool_id is set, ensuring a leaderboard entry
-- exists for every team assigned to a pool before any matches are played.
CREATE TRIGGER team_pool_assignment_trigger
AFTER UPDATE OF pool_id ON teams
FOR EACH ROW
WHEN (NEW.pool_id IS NOT NULL)
EXECUTE FUNCTION initialize_leaderboard_on_team_pool_assignment();