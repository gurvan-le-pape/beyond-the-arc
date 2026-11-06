-- One trigger for every change to a match: take back the result the old row
-- counted, then add the result the new row counts. A corrected score, a match
-- reset to scheduled and a delete all follow from that, with no case of their
-- own. Only a completed match counts (`matches_result_iff_completed`).
--
-- Explicit transaction: `migrate deploy` commits each statement separately, and
-- matches must not be left without a trigger if a statement here fails.
BEGIN;

DROP TRIGGER match_insert_trigger ON matches;
DROP TRIGGER match_update_trigger ON matches;
DROP TRIGGER match_delete_trigger ON matches;
DROP FUNCTION update_leaderboards_on_match_insert();
DROP FUNCTION update_leaderboards_on_match_update();
DROP FUNCTION update_leaderboards_on_match_delete();

-- Adds one team's side of a result (sign 1), or takes it back (sign -1). Taking
-- back creates no row: the row is already gone when a deleted pool cascades.
CREATE FUNCTION apply_team_result(
    p_pool_id INT, p_team_id INT,
    p_scored INT, p_conceded INT,
    p_won INT, p_lost INT, p_forfeited INT, p_points INT,
    p_sign INT
) RETURNS VOID AS $$
BEGIN
    IF p_sign = 1 THEN
        INSERT INTO leaderboards (pool_id, team_id)
        VALUES (p_pool_id, p_team_id)
        ON CONFLICT (pool_id, team_id) DO NOTHING;
    END IF;

    UPDATE leaderboards
    SET games_played = games_played + p_sign,
        games_won = games_won + p_sign * p_won,
        games_lost = games_lost + p_sign * p_lost,
        games_forfeited = games_forfeited + p_sign * p_forfeited,
        points_for = points_for + p_sign * p_scored,
        points_against = points_against + p_sign * p_conceded,
        point_difference = point_difference + p_sign * (p_scored - p_conceded),
        points = points + p_sign * p_points
    WHERE pool_id = p_pool_id AND team_id = p_team_id;
END;
$$ LANGUAGE plpgsql;

-- A win is 2 points and a loss 1. A forfeit is always the home team's: 0 points
-- for it, and the win for the away team whatever the score. `no_draws_allowed`
-- rules out a draw.
CREATE FUNCTION apply_match_result(m matches, p_sign INT) RETURNS VOID AS $$
DECLARE
    home_won BOOLEAN := NOT m.forfeit AND m.home_team_score > m.away_team_score;
    away_won BOOLEAN := m.forfeit OR m.away_team_score > m.home_team_score;
BEGIN
    PERFORM apply_team_result(
        m.pool_id, m.home_team_id,
        m.home_team_score, m.away_team_score,
        home_won::INT,
        (NOT m.forfeit AND m.home_team_score < m.away_team_score)::INT,
        m.forfeit::INT,
        CASE WHEN m.forfeit THEN 0 WHEN home_won THEN 2 ELSE 1 END,
        p_sign
    );
    PERFORM apply_team_result(
        m.pool_id, m.away_team_id,
        m.away_team_score, m.home_team_score,
        away_won::INT,
        (NOT m.forfeit AND m.away_team_score < m.home_team_score)::INT,
        0,
        CASE WHEN away_won THEN 2 ELSE 1 END,
        p_sign
    );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION update_leaderboards_on_match_change() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP <> 'INSERT' AND OLD.status = 'completed' THEN
        PERFORM apply_match_result(OLD, -1);
    END IF;
    IF TG_OP <> 'DELETE' AND NEW.status = 'completed' THEN
        PERFORM apply_match_result(NEW, 1);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER match_leaderboard_trigger
AFTER INSERT OR UPDATE OR DELETE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_change();

COMMIT;
