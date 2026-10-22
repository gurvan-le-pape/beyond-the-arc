// src/frontend/features/site/home/components/MapBand.tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { buttonVariants, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

/**
 * The map preview, one capture per theme. Each is a still of `/map` taken in
 * that theme, so it matches the live basemap treatment (`BASEMAP_PAINT`)
 * rather than imitating it with CSS filters, which would also invert the club
 * markers. Only the active theme's image is displayed, and a lazy image that is
 * not displayed is not fetched.
 *
 * Literal class strings, so Tailwind sees the arbitrary high-contrast variant.
 */
const PREVIEWS = [
  {
    src: "/home/clubs-map-light.webp",
    className: "block dark:hidden [.high-contrast_&]:hidden",
  },
  { src: "/home/clubs-map-dark.webp", className: "hidden dark:block" },
  {
    src: "/home/clubs-map-high-contrast.webp",
    className: "hidden [.high-contrast_&]:block",
  },
] as const;

/**
 * The home page's map band: the pitch and a link on one side, a still of the
 * club map on the other, stacked on a phone.
 *
 * The still shows OpenStreetMap tiles, so it carries their attribution.
 */
export function MapBand() {
  const t = useTranslations("home.map");

  return (
    <section
      aria-labelledby="map-band-title"
      className="border-b border-divide px-6 py-12 md:px-8"
    >
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col items-start">
          <Text variant="overline" className="text-ink-clubs">
            {t("eyebrow")}
          </Text>
          <Text variant="h2" id="map-band-title" className="mt-3">
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

        <figure>
          {/* The button above is the labelled way in; the picture is a larger
              target for the same place, so it stays out of the tab order. */}
          <Link
            href="/map"
            tabIndex={-1}
            aria-hidden
            className="block overflow-hidden rounded-card border border-divide"
          >
            {PREVIEWS.map((preview) => (
              <Image
                key={preview.src}
                src={preview.src}
                alt=""
                width={960}
                height={801}
                sizes="(min-width: 768px) 60vw, 100vw"
                className={`h-auto w-full ${preview.className}`}
              />
            ))}
          </Link>
          <figcaption className="mt-2 text-right">
            <Text variant="caption" as="span">
              <TextLink
                href="https://www.openstreetmap.org/copyright"
                external
                variant="plain"
              >
                {t("attribution")}
              </TextLink>
            </Text>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
