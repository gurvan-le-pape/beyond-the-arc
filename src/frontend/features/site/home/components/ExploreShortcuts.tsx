// src/frontend/features/site/home/components/ExploreShortcuts.tsx
import { useTranslations } from "next-intl";

import { EXPLORE_CARDS } from "@/features/site/home/constants";
import { Grid } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import { ExploreCard } from "./ExploreCard";

/** The three ways into the data — players, teams, matches — as linked cards. */
export function ExploreShortcuts() {
  const t = useTranslations("home.explore");

  return (
    <section aria-labelledby="explore-shortcuts-title">
      <div className="px-6 pt-7 pb-2 border-b border-divide">
        <Text variant="overline" as="h2" id="explore-shortcuts-title">
          {t("sectionTitle")}
        </Text>
      </div>

      <div className="border-b border-divide">
        <Grid columns={{ base: 1, md: 3 }} divided>
          {EXPLORE_CARDS.map((card) => (
            <ExploreCard
              key={card.href}
              href={card.href}
              badgeVariant={card.badgeVariant}
              badge={t(`${card.key}.badge`)}
              title={t(`${card.key}.title`)}
              desc={t(`${card.key}.desc`)}
            />
          ))}
        </Grid>
      </div>
    </section>
  );
}
