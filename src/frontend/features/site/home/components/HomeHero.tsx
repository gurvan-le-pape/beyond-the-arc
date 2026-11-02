// src/frontend/features/site/home/components/HomeHero.tsx
import { useLocale, useTranslations } from "next-intl";

import { getPathname } from "@/navigation";
import { Dot } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import { HeroSearch } from "./HeroSearch";

/**
 * The home page's opening band: what the site is, in a heading and a line, and
 * a search box that submits to the search page.
 */
export function HomeHero() {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const locale = useLocale();

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

      <div className="mt-8 flex w-full justify-center">
        <HeroSearch
          action={getPathname({ href: "/search", locale })}
          label={t("searchLabel")}
          placeholder={t("searchPlaceholder")}
          submit={t("searchSubmit")}
          clearLabel={tCommon("clearSearch")}
        />
      </div>
    </section>
  );
}
