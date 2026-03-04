-- Add index for fast event lookup by match
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);

-- Add index for fast event player lookup by event
CREATE INDEX IF NOT EXISTS idx_match_event_players_event_id ON match_event_players(event_id);
