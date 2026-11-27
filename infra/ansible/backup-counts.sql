-- The figures a restored backup is checked by, against production or another restore of
-- the same dump: restore-test.sh, and ../k8s/restore.sh for the lab.
select (select count(*) from matches) as matches,
  (select count(*) from matches where status = 'completed') as completed,
  (select count(*) from match_events) as match_events,
  (select count(*) from players) as players, (select count(*) from teams) as teams,
  (select count(*) from clubs) as clubs, (select max(id) from match_events) as last_match_event_id;
