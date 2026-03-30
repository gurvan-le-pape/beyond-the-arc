// src/frontend/features/organizations/clubs/components/detail/ClubHeader.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

import { Card } from "@/shared/components/primitives";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

import type { ClubDetailed } from "../../types/ClubDetailed";

/**
 * Club Header Component
 * Displays club name and logo
 *
 * Updated with:
 * - Dark mode support
 * - Design tokens
 * - Improved layout
 */
interface ClubHeaderProps {
  readonly club: ClubDetailed;
}

export function ClubHeader({ club }: ClubHeaderProps) {
  const [logoSrc, setLogoSrc] = useState(
    `/images/clubs/${formatNameToFileName(club.name)}.webp`,
  );
  return (
    <Card variant="highlighted" padding="lg">
      <div className="flex items-center gap-6">
        {/* Club Logo */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
          <Image
            src={logoSrc}
            alt={`${club.name} logo`}
            fill
            className="object-contain"
            onError={() => setLogoSrc("/images/clubs/defaultLogo.30cc7520.svg")}
            priority
          />
        </div>

        {/* Club Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-heading dark:text-text-heading-dark mb-2">
            {club.name}
          </h1>
          {club.city && (
            <p className="text-text-body dark:text-text-body-dark">
              {club.city}
              {club.zipCode && ` • ${club.zipCode}`}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ClubHeader;
