// src/frontend/features/organizations/shared/components/detail/OrganizationHeader.tsx
"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

import { ClubMark } from "@/shared/components/domain";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatNameToFileName } from "@/shared/utils";

type OrganizationImageFolder = "clubs" | "leagues" | "committees";

interface OrganizationHeaderProps {
  /**
   * Displayed as the heading **and** used as the logo lookup key, via
   * `formatNameToFileName`. A name that does not match a shipped file falls
   * back to the default crest rather than erroring.
   */
  readonly name: string;
  /** Which `public/images/*` directory the logo is looked up in. */
  readonly imageFolder: OrganizationImageFolder;
  /** Secondary line under the heading — city, department, or similar. */
  readonly subtitle?: ReactNode;
}

/**
 * Card heading for a league, committee or club detail page: logo, name, and an
 * optional subtitle line.
 *
 * The logo is resolved from the props, not passed in:
 * `/images/{imageFolder}/{formatNameToFileName(name)}.webp`. Renaming an
 * organisation upstream therefore swaps its logo for the default silently, and
 * the two stay in step only if the asset is renamed alongside it.
 *
 * Only `leagues` and `committees` ship real logos. There is no per-club
 * artwork for the thousands of clubs, so a club is drawn as its `ClubMark`.
 *
 * `"use client"` is here for one reason: the `onError` fallback needs state.
 * Nothing else in this component is interactive, so keep it that way rather
 * than letting the boundary grow.
 */
export function OrganizationHeader({
  name,
  imageFolder,
  subtitle,
}: OrganizationHeaderProps) {
  const [logoSrc, setLogoSrc] = useState(
    `/images/${imageFolder}/${formatNameToFileName(name)}.webp`,
  );

  const FALLBACK_LOGO = `/images/${imageFolder}/defaultLogo.30cc7520.svg`;

  return (
    <Card padding="lg">
      <div className="flex items-center gap-6">
        {imageFolder === "clubs" ? (
          <ClubMark clubName={name} size="2xl" />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            {/* Intrinsic size rather than `fill`: `fill` has no idea how big it
              will be drawn, so it defaults `sizes` to `100vw` and the browser
              requests a viewport-sized candidate — it was fetching the 1920w
              variant for a logo drawn at 96px. Given a width, next/image
              derives the 1x/2x candidates itself, so there is no `sizes`
              string duplicating the box classes and nothing to drift.
              The CSS still owns the drawn size; 96 is the larger of the two
              breakpoints, so the image is never upscaled. */}
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              width={96}
              height={96}
              className="w-full h-full object-contain"
              onError={() => setLogoSrc(FALLBACK_LOGO)}
              priority
            />
          </div>
        )}
        <div className="flex-1">
          <Text variant="h1" className="text-xl md:text-2xl">
            {name}
          </Text>
          {subtitle && <Text variant="body">{subtitle}</Text>}
        </div>
      </div>
    </Card>
  );
}
