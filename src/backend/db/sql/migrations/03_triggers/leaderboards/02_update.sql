CREATE OR REPLACE FUNCTION update_leaderboards_on_match_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only fire when transitioning to completed
    IF NEW.status != 'completed' THEN
        RETURN NEW;
    END IF;

    -- Prevent double-counting if somehow called again on a completed match
    IF OLD.status = 'completed' THEN
        RETURN NEW;
    END IF;

    -- Update home team
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,
        NEW.home_team_id,
        1,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1
            ELSE 0
        END,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1
            ELSE 0
        END,
        CASE WHEN NEW.forfeit THEN 1 ELSE 0 END,
        NEW.home_team_score,
        NEW.away_team_score,
        NEW.home_team_score - NEW.away_team_score,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2
            ELSE 1
        END
    )
    ON CONFLICT (pool_id, team_id) DO UPDATE SET
        games_played = leaderboards.games_played + 1,
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1
            ELSE 0
        END),
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1
            ELSE 0
        END),
        games_forfeited = leaderboards.games_forfeited + (CASE WHEN NEW.forfeit THEN 1 ELSE 0 END),
        points_for = leaderboards.points_for + NEW.home_team_score,
        points_against = leaderboards.points_against + NEW.away_team_score,
        point_difference = leaderboards.point_difference + (NEW.home_team_score - NEW.away_team_score),
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2
            ELSE 1
        END);

    -- Update away team
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,
        NEW.away_team_id,
        1,
        CASE 
            WHEN NEW.forfeit THEN 1
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1
            ELSE 0
        END,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1
            ELSE 0
        END,
        0,
        NEW.away_team_score,
        NEW.home_team_score,
        NEW.away_team_score - NEW.home_team_score,
        CASE 
            WHEN NEW.forfeit THEN 2
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2
            ELSE 1
        END
    )
    ON CONFLICT (pool_id, team_id) DO UPDATE SET
        games_played = leaderboards.games_played + 1,
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 1
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1
            ELSE 0
        END),
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1
            ELSE 0
        END),
        games_forfeited = leaderboards.games_forfeited + 0,
        points_for = leaderboards.points_for + NEW.away_team_score,
        points_against = leaderboards.points_against + NEW.home_team_score,
        point_difference = leaderboards.point_difference + (NEW.away_team_score - NEW.home_team_score),
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 2
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2
            ELSE 1
        END);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS match_update_trigger ON matches;

CREATE TRIGGER match_update_trigger
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_update();