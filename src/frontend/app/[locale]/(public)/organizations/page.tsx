// src/frontend/app/[locale]/(public)/organizations/page.tsx
"use client";

import { useTranslations } from "next-intl";
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
      "from-regional-light/20 to-regional-light/10 border-regional-DEFAULT hover:border-regional-dark dark:from-regional-dark/20 dark:to-regional-dark/10 dark:border-regional-light dark:hover:border-regional-dark";
  } else if (id === OrganizationType.COMMITTEES) {
    colorClasses =
      "from-departmental-light/20 to-departmental-light/10 border-departmental-DEFAULT hover:border-departmental-dark dark:from-departmental-dark/20 dark:to-departmental-dark/10 dark:border-departmental-light dark:hover:border-departmental-dark";
  } else if (id === OrganizationType.CLUBS) {
    colorClasses =
      "from-clubs-light/20 to-clubs-light/10 border-clubs-DEFAULT hover:border-clubs-dark dark:from-clubs-dark/20 dark:to-clubs-dark/10 dark:border-clubs-light dark:hover:border-clubs-dark";
  }

  return (
    <Link
      href={href}
      className={`cursor-pointer bg-gradient-to-br border-2 rounded-card flex flex-col items-center justify-center p-8 transition-all duration-200 hover:scale-105 shadow-card hover:shadow-card-hover dark:shadow-card-dark group ${colorClasses} focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-surface-base-dark`}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>

      {React.cloneElement(icon, { "aria-hidden": true, focusable: false })}

      <div className="text-xl font-semibold mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200 dark:text-text-heading-dark">
        {label}
      </div>

      <div className="text-sm text-text-body dark:text-text-body-dark text-center">
        {description}
      </div>
    </Link>
  );
};

export default function OrganizationsPage() {
  const t = useTranslations("organizations");

  const types: OrgType[] = [
    {
      id: OrganizationType.LEAGUES,
      label: t(`${OrganizationType.LEAGUES}.label`),
      description: t(`${OrganizationType.LEAGUES}.description`),
      icon: (
        <FaMapMarkedAlt className="text-5xl text-regional-dark dark:text-regional-light mb-4" />
      ),
      href: `/organizations/${OrganizationType.LEAGUES}`,
    },
    {
      id: OrganizationType.COMMITTEES,
      label: t(`${OrganizationType.COMMITTEES}.label`),
      description: t(`${OrganizationType.COMMITTEES}.description`),
      icon: (
        <FaBuilding className="text-5xl text-departmental-dark dark:text-departmental-light mb-4" />
      ),
      href: `/organizations/${OrganizationType.COMMITTEES}`,
    },
    {
      id: OrganizationType.CLUBS,
      label: t(`${OrganizationType.CLUBS}.label`),
      description: t(`${OrganizationType.CLUBS}.description`),
      icon: (
        <FaUsers className="text-5xl text-clubs-dark dark:text-clubs-light mb-4" />
      ),
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
