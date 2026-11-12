// src/frontend/features/site/home/components/clubs-map-teaser/ClubsMapPreview.tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { TextLink } from "@/shared/components/primitives";
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
 * A still of the club map in the active theme, linking to `/map`.
 *
 * The still shows OpenStreetMap tiles, so it carries their attribution.
 */
export function ClubsMapPreview() {
  const t = useTranslations("home.map");

  return (
    <figure>
      {/* The teaser's button is the labelled way in; the picture is a larger
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
  );
}
