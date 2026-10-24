// src/frontend/features/site/home/components/StatsBand.tsx
import { useLocale, useTranslations } from "next-intl";

import type { Stats } from "@/features/stats/types";
import { StatGroup } from "@/shared/components/stats";

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
  const locale = useLocale();

  return (
    <div className="border-b border-divide">
      <StatGroup
        stats={STATS_BAND_KEYS.map((key) => ({
          value: stats[key].toLocaleString(locale),
          label: t(key),
        }))}
        columns={{ base: 3, md: 6 }}
      />
    </div>
  );
}

export default StatsBand;
