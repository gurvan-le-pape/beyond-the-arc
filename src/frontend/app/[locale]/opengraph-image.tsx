// src/frontend/app/[locale]/opengraph-image.tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Beyond The Arc";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

// Radix indigo (dark scale), the brand tone of styles/tones.json. Inline values,
// not tokens: the image is rendered by Satori, which has no stylesheet.
const BACKGROUND = "#11131f";
const RULE = "#304384";
const TEXT = "#d6e1ff";
const EMPHASIS = "#9eb1ff";

/**
 * The link-preview image every page of a locale shares: the mark and the home
 * page's headline, in that locale.
 *
 * Next adds it as `og:image` (and, through the `twitter` card set in the
 * locale layout, `twitter:image`) to every route under `[locale]`. It depends
 * on nothing but the locale, so it is static: rendered on a locale's first
 * request, then served from the cache.
 *
 * @param props - the route's params
 * @param props.params - the locale segment
 * @returns the 1200×630 PNG
 */
export default async function OpengraphImage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const mark = await readFile(
    join(process.cwd(), "public/BeyondTheArcMark-dark.png"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: BACKGROUND,
        color: TEXT,
      }}
    >
      <img
        alt={alt}
        src={`data:image/png;base64,${mark.toString("base64")}`}
        width={219}
        height={96}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 28, color: EMPHASIS }}>{t("hero.eyebrow")}</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 72,
            lineHeight: 1.1,
          }}
        >
          {t("hero.titleStart")}&nbsp;
          <span style={{ color: EMPHASIS }}>{t("hero.titleEmphasis")}</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: `2px solid ${RULE}`,
          paddingTop: 24,
          fontSize: 28,
        }}
      >
        beyondthearc.app
      </div>
    </div>,
    size,
  );
}
