-- Empties every table the scheduler generates, so that the schema changes after
-- this one run on empty tables and the scheduler regenerates the season up to
-- today. Clubs and the geography come from migrations and stay.
--
-- A single statement, so it is atomic without an explicit transaction. No
-- CASCADE: a foreign key from a table not listed here fails the statement
-- rather than emptying that table too.
TRUNCATE TABLE
  match_event_players,
  match_events,
  shot_locations,
  player_match_stats,
  leaderboards,
  matches,
  players,
  teams,
  pools,
  championships,
  seeding_checkpoints
RESTART IDENTITY;
