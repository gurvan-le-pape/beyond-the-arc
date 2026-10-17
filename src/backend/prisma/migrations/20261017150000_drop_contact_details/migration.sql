-- Drops the contact details scraped from FFBB: every league's, committee's and
-- club's phone and email, and the presidents table with the links to it —
-- named individuals, most numbers 06/07 mobiles. The site links to each
-- organisation's FFBB page instead, which FFBB keeps current, and the API
-- stopped serving these fields before this migration ran.
--
-- 1_seed_static_data still inserts them on a fresh database; this migration
-- removes them right after. Irreversible: the data is only recoverable by
-- re-scraping FFBB.

-- DropForeignKey
ALTER TABLE "clubs" DROP CONSTRAINT "clubs_president_id_fkey";

-- DropForeignKey
ALTER TABLE "committees" DROP CONSTRAINT "committees_president_id_fkey";

-- DropForeignKey
ALTER TABLE "leagues" DROP CONSTRAINT "leagues_president_id_fkey";

-- AlterTable
ALTER TABLE "clubs" DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "president_id";

-- AlterTable
ALTER TABLE "committees" DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "president_id";

-- AlterTable
ALTER TABLE "leagues" DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "president_id";

-- DropTable
DROP TABLE "presidents";

