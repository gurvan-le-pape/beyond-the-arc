// src/frontend/features/site/home/components/HomeStats.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { Stats } from "@/features/stats/types";
import { StatGroup } from "@/shared/components/blocks";

/**
 * Keys into the stats payload, in display order; also the `home.stats.*`
 * label keys.
 */
const STATS_BAND_KEYS = [
  "clubs",
  "teams",
  "players",
  "matches",
  "leagues",
  "committees",
] as const;

interface HomeStatsProps {
  readonly stats: Stats;
}

/**
 * The site's totals in one band — clubs, teams, players, matches, leagues and
 * committees. Three columns over two rows on a phone, six in one row from md.
 */
export function HomeStats({ stats }: HomeStatsProps) {
  const t = useTranslations("home.stats");
  const format = useFormatter();

  return (
    <div className="border-b border-divide">
      <StatGroup
        stats={STATS_BAND_KEYS.map((key) => ({
          value: format.number(stats[key]),
          label: t(key),
        }))}
        columns={{ base: 3, md: 6 }}
      />
    </div>
  );
}
