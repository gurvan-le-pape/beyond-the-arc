// src/frontend/features/organizations/shared/components/detail/OrganizationHeader.tsx
"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatNameToFileName } from "@/shared/utils";

type OrganizationImageFolder = "clubs" | "leagues" | "committees";

interface OrganizationHeaderProps {
  readonly name: string;
  readonly imageFolder: OrganizationImageFolder;
  readonly subtitle?: ReactNode;
}

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
    <Card variant="highlighted" padding="lg">
      <div className="flex items-center gap-6">
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
