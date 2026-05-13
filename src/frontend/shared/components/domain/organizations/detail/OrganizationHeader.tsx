// src/frontend/shared/components/domain/organizations/detail/OrganizationHeader.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatNameToFileName } from "@/shared/utils";

type OrganizationImageFolder = "clubs" | "leagues" | "committees";

interface OrganizationHeaderProps {
  readonly name: string;
  readonly imageFolder: OrganizationImageFolder;
  readonly subtitle?: string;
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
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <Image
            src={logoSrc}
            alt={`${name} logo`}
            fill
            className="object-contain"
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
