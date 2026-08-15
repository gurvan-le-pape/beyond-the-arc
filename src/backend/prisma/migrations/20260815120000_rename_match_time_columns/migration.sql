-- Rename the two match time columns so their names say what they hold.
-- `matches.date` is a tip-off instant, not a calendar day (the calendar-day
-- filter is the `date` query parameter, which keeps its name); `match_events.timestamp`
-- is the instant an event occurred.
--
-- RENAME COLUMN is a catalogue-only operation: no table rewrite, no lock beyond
-- the brief ACCESS EXCLUSIVE the ALTER itself takes, on either table.

ALTER TABLE "matches" RENAME COLUMN "date" TO "starts_at";
ALTER TABLE "match_events" RENAME COLUMN "timestamp" TO "occurred_at";

-- Indexes follow their column automatically; their names do not.
-- The first two are declared in schema.prisma via `map:`; the third is the
-- partial index the PSL cannot express, created by hand in `0_init`.
ALTER INDEX "idx_matches_pool_id_date" RENAME TO "idx_matches_pool_id_starts_at";
ALTER INDEX "idx_matches_date" RENAME TO "idx_matches_starts_at";
ALTER INDEX "idx_matches_status_date" RENAME TO "idx_matches_status_starts_at";
