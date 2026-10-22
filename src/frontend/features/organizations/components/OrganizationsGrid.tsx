// src/frontend/features/organizations/components/OrganizationsGrid.tsx
import { Building2, MapPin, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { OrganizationCounts } from "@/features/organizations/types";
import { OrganizationType } from "@/shared/constants";

import type { OrgType } from "./OrganizationTypeCard";
import { OrganizationTypeCard } from "./OrganizationTypeCard";

const ORG_TYPE_CONFIG = [
  {
    id: OrganizationType.LEAGUES,
    countKey: "leagues",
    labelKey: "leagues.label",
    descriptionKey: "leagues.description",
    icon: <MapPin aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.LEAGUES}`,
  },
  {
    id: OrganizationType.COMMITTEES,
    countKey: "committees",
    labelKey: "committees.label",
    descriptionKey: "committees.description",
    icon: <Building2 aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.COMMITTEES}`,
  },
  {
    id: OrganizationType.CLUBS,
    countKey: "clubs",
    labelKey: "clubs.label",
    descriptionKey: "clubs.description",
    icon: <Users aria-hidden focusable={false} />,
    href: `/organizations/${OrganizationType.CLUBS}`,
  },
] as const;

interface OrganizationsGridProps {
  readonly counts: OrganizationCounts;
}

/**
 * The three organisation-type cards side by side, each with its count.
 *
 * An **async server component**; the counts come from the page's one fetch.
 */
export async function OrganizationsGrid({ counts }: OrganizationsGridProps) {
  const t = await getTranslations("organizations");

  const types: OrgType[] = ORG_TYPE_CONFIG.map((org) => ({
    id: org.id,
    icon: org.icon,
    href: org.href,
    label: t(org.labelKey),
    description: t(org.descriptionKey),
    count: counts[org.countKey],
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
