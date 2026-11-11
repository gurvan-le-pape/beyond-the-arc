// src/frontend/features/site/home/components/HomeHero.tsx
import { useTranslations } from "next-intl";

import { Dot } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

/**
 * The home page's opening band: what the site is, in a heading and a line.
 * Searching is the header's quick search, on every page.
 */
export function HomeHero() {
  const t = useTranslations("home.hero");

  return (
    <section className="flex flex-col items-center text-center px-6 py-16 border-b border-divide">
      <Text
        variant="overline"
        className="inline-flex items-center gap-1.5 text-ink-primary bg-tint-primary px-3 py-1 rounded mb-6"
      >
        <Dot size="sm" />
        {t("eyebrow")}
      </Text>

      <Text
        variant="h1"
        className="font-extrabold leading-none tracking-tight mb-5"
      >
        {t("titleStart")}{" "}
        <em className="not-italic text-ink-primary">{t("titleEmphasis")}</em>
      </Text>

      <Text variant="lead" className="max-w-lg">
        {t("subtitle")}
      </Text>
    </section>
  );
}
