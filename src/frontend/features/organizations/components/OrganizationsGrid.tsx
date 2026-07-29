// src/frontend/features/organizations/components/OrganizationsGrid.tsx
import { Building2, MapPin, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { OrganizationType } from "@/shared/constants";

import type { OrgType } from "./OrganizationTypeCard";
import { OrganizationTypeCard } from "./OrganizationTypeCard";

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

export async function OrganizationsGrid() {
  const t = await getTranslations("organizations");

  const types: OrgType[] = ORG_TYPE_CONFIG.map((org) => ({
    id: org.id,
    icon: org.icon,
    href: org.href,
    label: t(org.labelKey),
    description: t(org.descriptionKey),
    count: org.count,
  }));

  return (
    // Three columns, unlike the entity-result grids' two: these are the three
    // fixed navigation cards (leagues / committees / clubs), not a result list.
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {types.map((org) => (
        <OrganizationTypeCard key={org.id} org={org} />
      ))}
    </div>
  );
}
