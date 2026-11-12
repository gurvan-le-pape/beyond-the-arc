// src/frontend/features/site/home/components/clubs-map-teaser/index.tsx
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { buttonVariants } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import { ClubsMapPreview } from "./ClubsMapPreview";

/**
 * The home page's map band: the pitch and a link on one side, a still of the
 * club map on the other, stacked on a phone.
 */
export function ClubsMapTeaser() {
  const t = useTranslations("home.map");

  return (
    <section
      aria-labelledby="clubs-map-teaser-title"
      className="border-b border-divide px-6 py-12 md:px-8"
    >
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col items-start">
          <Text variant="overline" className="text-ink-clubs">
            {t("eyebrow")}
          </Text>
          <Text variant="h2" id="clubs-map-teaser-title" className="mt-3">
            {t("title")}
          </Text>
          <Text variant="caption" className="mt-2 max-w-sm">
            {t("desc")}
          </Text>
          <Link
            href="/map"
            className={
              buttonVariants({ variant: "primary", size: "sm" }) + " mt-5"
            }
          >
            {t("cta")}
          </Link>
        </div>

        <ClubsMapPreview />
      </div>
    </section>
  );
}
