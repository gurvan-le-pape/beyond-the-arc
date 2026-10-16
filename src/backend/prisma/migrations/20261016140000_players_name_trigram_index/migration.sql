-- Trigram index behind the player name search (`contains`, case-insensitive,
-- which Prisma emits as ILIKE '%term%'). A B-tree cannot serve a leading
-- wildcard, so without this every search scanned all ~720k players.
--
-- pg_trgm ships with PostgreSQL's contrib modules and is a trusted extension,
-- so the database owner can create it. Terms of fewer than three characters
-- produce no trigram and still scan the table.
--
-- CREATE INDEX (not CONCURRENTLY, which cannot run inside the migration's
-- transaction) blocks writes to players for the build, about two seconds on a
-- production-sized table; reads are unaffected.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "idx_players_name_trgm" ON "players" USING GIN ("name" gin_trgm_ops);
