-- Add index for fast event lookup by match
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);

-- Add index for fast event player lookup by event
CREATE INDEX IF NOT EXISTS idx_match_event_players_event_id ON match_event_players(event_id);

-- Add index for fast event player lookup by player
CREATE INDEX IF NOT EXISTS idx_match_event_players_player_id ON match_event_players(player_id);

-- Add index for fast player match stats lookup by player
CREATE INDEX IF NOT EXISTS idx_player_match_stats_player_id ON player_match_stats(player_id);

-- Partial index for the scheduler's polling query — only indexes scheduled matches,
-- shrinks automatically as matches are completed
CREATE INDEX IF NOT EXISTS idx_matches_status_date ON matches (status, date) WHERE status = 'scheduled';

-- Composite index for pool match listings — serves the pool_id filter and the
-- date ordering used by pool and championship match pages
CREATE INDEX IF NOT EXISTS idx_matches_pool_id_date ON matches (pool_id, date);

-- Add indexes for team match history (WHERE home_team_id = X OR away_team_id = X)
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches (home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches (away_team_id);

-- Add index for the global match list (ORDER BY date DESC, paginated) and date-range filters
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches (date);

-- Add index for team lookup by pool (pool rosters, pool-scoped team filters)
CREATE INDEX IF NOT EXISTS idx_teams_pool_id ON teams (pool_id);

-- Add index for committee- and league-scoped club filters
-- (clubs, teams, players, and matches queries all join through clubs.committee_id)
CREATE INDEX IF NOT EXISTS idx_clubs_committee_id ON clubs (committee_id);