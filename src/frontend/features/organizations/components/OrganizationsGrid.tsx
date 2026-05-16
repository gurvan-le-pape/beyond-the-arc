// src/frontend/features/organizations/components/OrganizationsGrid.tsx
import { Building2, MapPin, Users } from "lucide-react";
import type { useTranslations } from "next-intl";

import { OrganizationType } from "@/shared/constants";

import type { OrgType } from "./OrganizationTypeCard";
import { OrganizationTypeCard } from "./OrganizationTypeCard";

interface OrganizationsGridProps {
  readonly t: ReturnType<typeof useTranslations>;
}

const ORG_TYPE_CONFIG = [
  {
    id: OrganizationType.LEAGUES,
    labelKey: "leagues.label",
    descriptionKey: "leagues.description",
    icon: <MapPin aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.LEAGUES}`,
    count: 112,
  },
  {
    id: OrganizationType.COMMITTEES,
    labelKey: "committees.label",
    descriptionKey: "committees.description",
    icon: <Building2 aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.COMMITTEES}`,
    count: 25,
  },
  {
    id: OrganizationType.CLUBS,
    labelKey: "clubs.label",
    descriptionKey: "clubs.description",
    icon: <Users aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.CLUBS}`,
    count: 3883,
  },
] as const;

export function OrganizationsGrid({ t }: OrganizationsGridProps) {
  const types: OrgType[] = ORG_TYPE_CONFIG.map((org) => ({
    id: org.id,
    icon: org.icon,
    href: org.href,
    label: t(org.labelKey),
    description: t(org.descriptionKey),
    count: org.count,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {types.map((org) => (
        <OrganizationTypeCard key={org.id} org={org} t={t} />
      ))}
    </div>
  );
}
