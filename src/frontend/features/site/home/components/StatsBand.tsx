// src/frontend/features/site/home/components/StatsBand.tsx
import { useFormatter, useTranslations } from "next-intl";

import type { Stats } from "@/features/stats/types";
import { StatGroup } from "@/shared/components/blocks";

import { STATS_BAND_KEYS } from "../constants/homeSections";

interface StatsBandProps {
  readonly stats: Stats;
}

/**
 * The site's totals in one band — clubs, teams, players, matches, leagues and
 * committees. Three columns over two rows on a phone, six in one row from md.
 */
export function StatsBand({ stats }: StatsBandProps) {
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
