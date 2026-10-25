// src/frontend/features/organizations/components/detail/OrganizationInfo.tsx
"use client";

import { ExternalLink, Globe, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { InfoBox, Section } from "@/shared/components/blocks";
import { Grid } from "@/shared/components/primitives";
import { toSafeExternalUrl } from "@/shared/utils";

interface OrganizationInfoProps {
  readonly address?: string | null;
  readonly website?: string | null;
  readonly ffbbUrl?: string | null;
}

/**
 * The address panel on an organisation detail page, with a link to the
 * organisation's page on the FFBB site for anything else.
 *
 * Contact details — phone, email, the president — are FFBB's to publish and
 * keep current, and mostly a volunteer's own; the link sends the reader there
 * rather than this site carrying a copy. Every field is optional and absent
 * ones are omitted, so the panel shrinks to what is known. Both URLs go
 * through the safe-URL check.
 */
export function OrganizationInfo({
  address,
  website,
  ffbbUrl,
}: OrganizationInfoProps) {
  const t = useTranslations("organizations");

  // `website` is scraped, so it is untrusted input reaching an href. A value
  // that is not an absolute http(s) URL gets no tile, like null — which is
  // what the field is for every club in production, so a "not available" tile
  // would be on every page.
  const safeWebsite = toSafeExternalUrl(website);
  const safeFfbbUrl = toSafeExternalUrl(ffbbUrl);

  return (
    <Section title={t("info.title")}>
      <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <InfoBox
          label={t("info.address")}
          value={address}
          icon={<MapPin className="w-4 h-4" />}
        />
        {safeFfbbUrl && (
          <InfoBox
            label={t("info.contact")}
            value={t("info.ffbbPage")}
            href={safeFfbbUrl}
            hint={t("info.ffbbPageHint")}
            icon={<ExternalLink className="w-4 h-4" />}
          />
        )}
        {safeWebsite && (
          <InfoBox
            label={t("info.website")}
            value={t("info.visitWebsite")}
            href={safeWebsite}
            icon={<Globe className="w-4 h-4" />}
          />
        )}
      </Grid>
    </Section>
  );
}
