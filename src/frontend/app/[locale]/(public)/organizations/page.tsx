// src/frontend/app/[locale]/(public)/organizations/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";
import { FaBuilding, FaMapMarkedAlt, FaUsers } from "react-icons/fa";

import { Link } from "@/navigation";
import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import { OrganizationType } from "@/shared/constants";

interface OrgType {
  id: OrganizationType;
  label: string;
  description: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  href: string;
}

const OrganizationTypeCard: React.FC<{ org: OrgType }> = ({ org }) => {
  const { label, description, icon, href, id } = org;

  let colorClasses = "";
  if (id === OrganizationType.LEAGUES) {
    colorClasses =
      "from-regional-subtle to-regional-subtle/40 border-regional hover:border-regional-strong";
  } else if (id === OrganizationType.COMMITTEES) {
    colorClasses =
      "from-departmental-subtle to-departmental-subtle/40 border-departmental hover:border-departmental-strong";
  } else if (id === OrganizationType.CLUBS) {
    colorClasses =
      "from-clubs-subtle to-clubs-subtle/40 border-clubs hover:border-clubs-strong";
  }

  return (
    <Link
      href={href}
      className={`cursor-pointer bg-gradient-to-br border-2 rounded-card flex flex-col items-center justify-center p-8 transition-all duration-200 hover:scale-105 shadow-card hover:shadow-card-hover group ${colorClasses} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface`}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>

      {React.cloneElement(icon, { "aria-hidden": true, focusable: false })}

      <div className="text-xl font-semibold mb-2 group-hover:text-primary-bold transition-colors duration-200 text-text-heading">
        {label}
      </div>

      <div className="text-sm text-text-body text-center">{description}</div>
    </Link>
  );
};

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

  const types: OrgType[] = [
    {
      id: OrganizationType.LEAGUES,
      label: t(`${OrganizationType.LEAGUES}.label`),
      description: t(`${OrganizationType.LEAGUES}.description`),
      icon: <FaMapMarkedAlt className="text-5xl text-regional-strong mb-4" />,
      href: `/organizations/${OrganizationType.LEAGUES}`,
    },
    {
      id: OrganizationType.COMMITTEES,
      label: t(`${OrganizationType.COMMITTEES}.label`),
      description: t(`${OrganizationType.COMMITTEES}.description`),
      icon: <FaBuilding className="text-5xl text-departmental-strong mb-4" />,
      href: `/organizations/${OrganizationType.COMMITTEES}`,
    },
    {
      id: OrganizationType.CLUBS,
      label: t(`${OrganizationType.CLUBS}.label`),
      description: t(`${OrganizationType.CLUBS}.description`),
      icon: <FaUsers className="text-5xl text-clubs-strong mb-4" />,
      href: `/organizations/${OrganizationType.CLUBS}`,
    },
  ];

  return (
    <PageLayout centered>
      <Text variant="h1" className="mb-12 text-center">
        {t("selectType")}
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
        {types.map((org) => (
          <OrganizationTypeCard key={org.id} org={org} />
        ))}
      </div>
    </PageLayout>
  );
}
