// src/frontend/features/organizations/shared/components/detail/OrganizationInfo.tsx
"use client";

import { Globe, Mail, MapPin, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";

import type { President } from "@/features/organizations/types";
import { InfoBox, Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import { formatPhone, toSafeExternalUrl } from "@/shared/utils";

interface OrganizationInfoProps {
  readonly address?: string | null;
  readonly city?: string | null;
  readonly zipCode?: string | null;
  readonly phone?: string | null;
  readonly email?: string | null;
  readonly website?: string | null;
  readonly president?: President | null;
}

/**
 * The contact and address panel on an organisation detail page.
 *
 * Every field is optional and absent ones are omitted rather than shown blank,
 * so the panel shrinks to what is known. The website goes through the safe-URL
 * check, since that value is scraped rather than authored.
 */
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

  // `website` is scraped, so it is untrusted input reaching an href. A value
  // that is not an absolute http(s) URL renders as "no website" rather than as
  // a link — same treatment as null, which is what the field already is for
  // every club in production.
  const safeWebsite = toSafeExternalUrl(website);

  return (
    <Section title={t("info.title")} variant="highlighted">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoBox
          label={t("info.address")}
          value={address}
          icon={<MapPin className="w-4 h-4" />}
        />
        {city !== undefined && (
          <InfoBox
            label={t("info.city")}
            value={city}
            icon={<MapPin className="w-4 h-4" />}
          />
        )}
        {zipCode !== undefined && (
          <InfoBox
            label={t("info.zipCode")}
            value={zipCode}
            icon={<MapPin className="w-4 h-4" />}
          />
        )}
        <InfoBox
          label={t("info.phone")}
          value={formatPhone(phone)}
          href={phone ? `tel:${phone}` : undefined}
          icon={<Phone className="w-4 h-4" />}
        />
        <InfoBox
          label={t("info.email")}
          value={email}
          href={email ? `mailto:${email}` : undefined}
          icon={<Mail className="w-4 h-4" />}
        />
        {website !== undefined && (
          <InfoBox
            label={t("info.website")}
            value={safeWebsite ? t("info.visitWebsite") : null}
            href={safeWebsite}
            icon={<Globe className="w-4 h-4" />}
          />
        )}
      </div>

      {president !== undefined && (
        <>
          <div className="flex items-center gap-3 mt-6 mb-4">
            <Text variant="overline" as="span">
              {t("info.president.label")}
            </Text>
            <div className="flex-1 h-px bg-divide" />
          </div>
          {/* Name only. The API stopped returning the president's phone and
              email — they are a named individual's personal contact details on
              an endpoint anyone can enumerate, and the organisation's own
              contact details are already above. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoBox
              label={t("info.president.name")}
              value={president?.name ?? NA}
              icon={<User className="w-4 h-4" />}
            />
          </div>
        </>
      )}
    </Section>
  );
}
