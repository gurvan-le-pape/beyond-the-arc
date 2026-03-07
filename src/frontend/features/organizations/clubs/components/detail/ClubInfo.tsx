// src/frontend/features/organizations/clubs/components/detail/ClubInfo.tsx
"use client";

import {
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { InfoBox } from "@/shared/components/ui/composite";
import { formatPhone } from "@/shared/utils/helpers/string-helpers";

import type { ClubDetailed } from "../../types/ClubDetailed";

/**
 * Club Information Component
 * Displays club contact details in a consistent grid layout
 *
 * Now using:
 * - InfoBox component for consistency
 * - Design tokens for colors
 * - Dark mode support
 */
interface ClubInfoProps {
  club: ClubDetailed;
}

export function ClubInfo({ club }: ClubInfoProps) {
  const t = useTranslations("clubs");

  return (
    <section className="mb-8">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t("detail.infoTitle")}
      </h2>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Address */}
        <InfoBox
          label={t("detail.address")}
          value={club.address}
          icon={<MapPinIcon className="w-4 h-4" />}
        />

        {/* City */}
        <InfoBox
          label={t("detail.city")}
          value={club.city}
          icon={<MapPinIcon className="w-4 h-4" />}
        />

        {/* Zip Code */}
        <InfoBox
          label={t("detail.zipCode")}
          value={club.zipCode}
          icon={<MapPinIcon className="w-4 h-4" />}
        />

        {/* Phone */}
        <InfoBox
          label={t("detail.phone")}
          value={formatPhone(club.phone)}
          icon={<PhoneIcon className="w-4 h-4" />}
        />

        {/* Email */}
        <InfoBox
          label={t("detail.email")}
          value={club.email}
          href={club.email ? `mailto:${club.email}` : undefined}
          icon={<EnvelopeIcon className="w-4 h-4" />}
        />

        {/* Website */}
        <InfoBox
          label={t("detail.website")}
          value={club.website ? t("detail.visitWebsite") : null}
          href={club.website ?? undefined}
          icon={<GlobeAltIcon className="w-4 h-4" />}
        />
      </div>
    </section>
  );
}

export default ClubInfo;
