-- A match's pool is its home team's pool. Dropping the column also drops
-- idx_matches_pool_id_starts_at and the foreign key to pools.
ALTER TABLE "matches" DROP COLUMN "pool_id";
