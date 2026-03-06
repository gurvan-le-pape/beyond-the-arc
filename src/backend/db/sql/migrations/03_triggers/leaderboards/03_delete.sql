CREATE OR REPLACE FUNCTION update_leaderboards_on_match_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Revert match results for the home team
    UPDATE leaderboards
    SET
        games_played = games_played - 1,
        games_won = games_won - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no win
            WHEN OLD.home_team_score > OLD.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END),
        games_lost = games_lost - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN OLD.home_team_score < OLD.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END),
        games_forfeited = games_forfeited - (CASE 
            WHEN OLD.forfeit THEN 1 -- Forfeit: decrement games_forfeited
            ELSE 0 -- Not a forfeit
        END),
        points_for = points_for - OLD.home_team_score,
        points_against = points_against - OLD.away_team_score,
        point_difference = point_difference - (OLD.home_team_score - OLD.away_team_score),
        points = points - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: 0 points
            WHEN OLD.home_team_score > OLD.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END)
    WHERE pool_id = OLD.pool_id AND team_id = OLD.home_team_id;

    -- Revert match results for the away team
    UPDATE leaderboards
    SET
        games_played = games_played - 1,
        games_won = games_won - (CASE 
            WHEN OLD.forfeit THEN 1 -- Forfeit: away team wins
            WHEN OLD.away_team_score > OLD.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END),
        games_lost = games_lost - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN OLD.away_team_score < OLD.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END),
        points_for = points_for - OLD.away_team_score,
        points_against = points_against - OLD.home_team_score,
        point_difference = point_difference - (OLD.away_team_score - OLD.home_team_score),
        points = points - (CASE 
            WHEN OLD.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN OLD.away_team_score > OLD.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END)
    WHERE pool_id = OLD.pool_id AND team_id = OLD.away_team_id;

    RETURN OLD; -- Return the deleted match row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER match_delete_trigger
AFTER DELETE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_delete();
