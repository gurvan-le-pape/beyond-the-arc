// src/frontend/app/[locale]/(public)/organizations/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaBuilding, FaMapMarkedAlt, FaUsers } from "react-icons/fa";

import { OrganizationTypeCard, type OrgType } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import { OrganizationType } from "@/shared/constants";

const ORG_TYPE_CONFIG = [
  {
    id: OrganizationType.LEAGUES,
    labelKey: "leagues.label",
    descriptionKey: "leagues.description",
    icon: (
      <FaMapMarkedAlt
        className="text-5xl text-regional-strong mb-4"
        aria-hidden
        focusable={false}
      />
    ),
    href: `/organizations/${OrganizationType.LEAGUES}`,
  },
  {
    id: OrganizationType.COMMITTEES,
    labelKey: "committees.label",
    descriptionKey: "committees.description",
    icon: (
      <FaBuilding
        className="text-5xl text-departmental-strong mb-4"
        aria-hidden
        focusable={false}
      />
    ),
    href: `/organizations/${OrganizationType.COMMITTEES}`,
  },
  {
    id: OrganizationType.CLUBS,
    labelKey: "clubs.label",
    descriptionKey: "clubs.description",
    icon: (
      <FaUsers
        className="text-5xl text-clubs-strong mb-4"
        aria-hidden
        focusable={false}
      />
    ),
    href: `/organizations/${OrganizationType.CLUBS}`,
  },
] as const;

interface OrganizationsPageProps {
  readonly params: Promise<{ locale: string }>;
}

export const revalidate = 86400;
export const dynamic = "force-dynamic";

export default async function OrganizationsPage({
  params,
}: OrganizationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const types: OrgType[] = ORG_TYPE_CONFIG.map((org) => ({
    id: org.id,
    icon: org.icon,
    href: org.href,
    label: t(org.labelKey),
    description: t(org.descriptionKey),
  }));

  return (
    <PageLayout centered>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
        {types.map((org) => (
          <OrganizationTypeCard key={org.id} org={org} />
        ))}
      </div>
    </PageLayout>
  );
}
