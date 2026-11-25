-- Numbers the clubs from 1 without gaps, in their current order.
--
-- The new ids go through negative values so that no row meets an id, or a
-- team's (pool, club, number), that another row has yet to leave. The foreign
-- key is dropped for the duration: its ON UPDATE CASCADE would scan `teams`
-- once per club.
BEGIN;

ALTER TABLE teams DROP CONSTRAINT teams_club_id_fkey;

CREATE TEMPORARY TABLE club_numbers ON COMMIT DROP AS
SELECT id AS old_id, row_number() OVER (ORDER BY id)::integer AS new_id
FROM clubs;

UPDATE teams SET club_id = -n.new_id FROM club_numbers n WHERE teams.club_id = n.old_id;
UPDATE teams SET club_id = -club_id WHERE club_id < 0;

UPDATE clubs SET id = -n.new_id FROM club_numbers n WHERE clubs.id = n.old_id;
UPDATE clubs SET id = -id WHERE id < 0;

ALTER TABLE teams ADD CONSTRAINT teams_club_id_fkey
  FOREIGN KEY (club_id) REFERENCES clubs (id) ON DELETE CASCADE ON UPDATE CASCADE;

SELECT setval(pg_get_serial_sequence('clubs', 'id'), (SELECT max(id) FROM clubs));

COMMIT;
