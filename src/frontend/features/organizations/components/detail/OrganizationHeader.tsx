// src/frontend/features/organizations/components/detail/OrganizationHeader.tsx
import type { ReactNode } from "react";

import { StatGroup } from "@/shared/components/blocks";
import { ClubMark } from "@/shared/components/domain";
import { Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatNameToFileName } from "@/shared/utils";

type OrganizationImageFolder = "clubs" | "leagues" | "committees";

interface OrganizationHeaderStat {
  readonly value: string;
  readonly label: string;
}

interface OrganizationHeaderProps {
  /** The heading, and the logo's alt text. */
  readonly name: string;
  /**
   * The logo lookup key, via `formatNameToFileName`: the federation's name,
   * which is what the shipped files are named after. Defaults to `name`. A key
   * that matches no file falls back to the default crest rather than erroring.
   */
  readonly logoName?: string;
  /** Which `public/images/*` directory the logo is looked up in. */
  readonly imageFolder: OrganizationImageFolder;
  /** Secondary line under the heading — what the organisation is, where it is. */
  readonly subtitle?: ReactNode;
  /** A band of figures under the identity, such as its club count. */
  readonly stats?: readonly OrganizationHeaderStat[];
}

/**
 * Card heading for a league, committee or club detail page: logo, name, an
 * optional subtitle line, and an optional band of figures laid out like the
 * team and player headers'.
 *
 * The logo is resolved from the props, not passed in:
 * `/images/{imageFolder}/{formatNameToFileName(logoName ?? name)}.webp`. Renaming an
 * organisation upstream therefore swaps its logo for the default silently, and
 * the two stay in step only if the asset is renamed alongside it.
 *
 * Only `leagues` and `committees` ship real logos. There is no per-club
 * artwork for the thousands of clubs, so a club is drawn as its `ClubMark`.
 *
 * A server component: the one client piece is `ImageWithFallback`, which swaps
 * in the default crest when the logo file is missing.
 */
export function OrganizationHeader({
  name,
  logoName,
  imageFolder,
  subtitle,
  stats = [],
}: OrganizationHeaderProps) {
  const logoSrc = `/images/${imageFolder}/${formatNameToFileName(logoName ?? name)}.webp`;
  const fallbackLogo = `/images/${imageFolder}/defaultLogo.30cc7520.svg`;

  return (
    <Card variant="header" padding="none" className="overflow-hidden">
      <div className="flex items-center gap-4 p-4 sm:gap-6 sm:p-6">
        {imageFolder === "clubs" ? (
          <ClubMark clubName={name} size="2xl" />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            <ImageWithFallback
              src={logoSrc}
              alt=""
              fallback={fallbackLogo}
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Text variant="h1" className="text-xl md:text-2xl">
            {name}
          </Text>
          {subtitle && (
            <Text variant="body" className="mt-1 text-text-secondary">
              {subtitle}
            </Text>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <div className="border-t border-divide">
          <StatGroup stats={stats} />
        </div>
      )}
    </Card>
  );
}
