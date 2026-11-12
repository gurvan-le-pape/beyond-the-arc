// src/frontend/features/site/about/components/AboutData.tsx
import { useTranslations } from "next-intl";

import type { Stats } from "@/features/stats/types";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface AboutDataProps {
  readonly stats: Stats;
}

/**
 * Which of the site's data is real and which is simulated, with the counts
 * read from `/stats` so the copy follows the data instead of going stale.
 */
export function AboutData({ stats }: AboutDataProps) {
  const t = useTranslations("landing.about.data");
  const { national, regional, departmental } = stats.championshipsByLevel;

  return (
    <Card padding="lg" heading={t("title")}>
      <div className="space-y-4">
        <Text>
          {t("real", {
            leagues: stats.leagues,
            committees: stats.committees,
            clubs: stats.clubs,
          })}
        </Text>
        <Text>
          {t("simulated", {
            championships: national + regional + departmental,
            teams: stats.teams,
            players: stats.players,
          })}
        </Text>
      </div>
    </Card>
  );
}
