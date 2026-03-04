CREATE OR REPLACE FUNCTION update_leaderboards_on_match_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Update home team stats
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id, -- Pool ID from the new match
        NEW.home_team_id, -- Home team ID from the new match
        1, -- Increment games_played by 1
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no win
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END, -- games_won
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END, -- games_lost
        CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: increment games_forfeited
            ELSE 0 -- Not a forfeit
        END, -- games_forfeited
        NEW.home_team_score, -- points_for (home team's goals)
        NEW.away_team_score, -- points_against (away team's goals)
        NEW.home_team_score - NEW.away_team_score, -- point_difference
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: 0 points
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END -- points
    )
    ON CONFLICT (pool_id, team_id) -- Handle conflict if the team already exists in the leaderboard
    DO UPDATE SET
        games_played = leaderboards.games_played + 1, -- Increment games_played
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no win
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END), -- Update games_won
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END), -- Update games_lost
        games_forfeited = leaderboards.games_forfeited + (CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: increment games_forfeited
            ELSE 0 -- Not a forfeit
        END), -- Update games_forfeited
        points_for = leaderboards.points_for + NEW.home_team_score, -- Update points_for
        points_against = leaderboards.points_against + NEW.away_team_score, -- Update points_against
        point_difference = leaderboards.point_difference + (NEW.home_team_score - NEW.away_team_score), -- Update point_difference
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: 0 points
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END); -- Update points

    -- Update away team stats (similar logic)
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id, -- Pool ID from the new match
        NEW.away_team_id, -- Away team ID from the new match
        1, -- Increment games_played by 1
        CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: away team wins
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END, -- games_won
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END, -- games_lost
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: home team forfeits, away team does not forfeit
            ELSE 0 -- Not a forfeit
        END, -- games_forfeited
        NEW.away_team_score, -- points_for (away team's goals)
        NEW.home_team_score, -- points_against (home team's goals)
        NEW.away_team_score - NEW.home_team_score, -- point_difference
        CASE 
            WHEN NEW.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END -- points
    )
    ON CONFLICT (pool_id, team_id) -- Handle conflict if the team already exists in the leaderboard
    DO UPDATE SET
        games_played = leaderboards.games_played + 1, -- Increment games_played
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: away team wins
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END), -- Update games_won
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END), -- Update games_lost
        games_forfeited = leaderboards.games_forfeited + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: home team forfeits, away team does not forfeit
            ELSE 0 -- Not a forfeit
        END), -- Update games_forfeited
        points_for = leaderboards.points_for + NEW.away_team_score, -- Update points_for
        points_against = leaderboards.points_against + NEW.home_team_score, -- Update points_against
        point_difference = leaderboards.point_difference + (NEW.away_team_score - NEW.home_team_score), -- Update point_difference
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END); -- Update points

    RETURN NEW; -- Return the new match row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER match_insert_trigger
AFTER INSERT ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_insert();
