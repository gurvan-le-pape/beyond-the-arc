// src/frontend/shared/components/domain/organizations/detail/OrganizationInfo.tsx
"use client";

import {
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { InfoBox, Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import type { President } from "@/shared/types";
import { formatPhone } from "@/shared/utils/helpers/string-helpers";

interface OrganizationInfoProps {
  readonly address?: string | null;
  readonly city?: string | null;
  readonly zipCode?: string | null;
  readonly phone?: string | null;
  readonly email?: string | null;
  readonly website?: string | null;
  readonly president?: President | null;
}

export function OrganizationInfo({
  address,
  city,
  zipCode,
  phone,
  email,
  website,
  president,
}: OrganizationInfoProps) {
  const t = useTranslations("organizations");

  return (
    <Section title={t("info.title")} variant="highlighted">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoBox
          label={t("info.address")}
          value={address}
          icon={<MapPinIcon className="w-4 h-4" />}
        />
        {city !== undefined && (
          <InfoBox
            label={t("info.city")}
            value={city}
            icon={<MapPinIcon className="w-4 h-4" />}
          />
        )}
        {zipCode !== undefined && (
          <InfoBox
            label={t("info.zipCode")}
            value={zipCode}
            icon={<MapPinIcon className="w-4 h-4" />}
          />
        )}
        <InfoBox
          label={t("info.phone")}
          value={formatPhone(phone)}
          href={phone ? `tel:${phone}` : undefined}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
        <InfoBox
          label={t("info.email")}
          value={email}
          href={email ? `mailto:${email}` : undefined}
          icon={<EnvelopeIcon className="w-4 h-4" />}
        />
        {website !== undefined && (
          <InfoBox
            label={t("info.website")}
            value={website ? t("info.visitWebsite") : null}
            href={website ?? undefined}
            icon={<GlobeAltIcon className="w-4 h-4" />}
          />
        )}
      </div>

      {president !== undefined && (
        <>
          <div className="flex items-center gap-3 mt-6 mb-4">
            <Text variant="overline" as="span">
              {t("info.president.label")}
            </Text>
            <div className="flex-1 h-px bg-divide-light dark:bg-divide-dark" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoBox
              label={t("info.president.name")}
              value={president?.name ?? NA}
              icon={<UserIcon className="w-4 h-4" />}
            />
            <InfoBox
              label={t("info.president.email")}
              value={president?.email}
              href={president?.email ? `mailto:${president.email}` : undefined}
              icon={<EnvelopeIcon className="w-4 h-4" />}
            />
            <InfoBox
              label={t("info.president.phone")}
              value={formatPhone(president?.phone)}
              href={president?.phone ? `tel:${president.phone}` : undefined}
              icon={<PhoneIcon className="w-4 h-4" />}
            />
          </div>
        </>
      )}
    </Section>
  );
}
