// src/frontend/features/organizations/components/OrganizationTypes.tsx
import { Building2, MapPin, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { Stats } from "@/features/stats/types";
import { Grid } from "@/shared/components/primitives";
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

interface OrganizationTypesProps {
  /** The platform stats; only the three organisation counts are read. */
  readonly stats: Pick<Stats, "leagues" | "committees" | "clubs">;
}

/**
 * The three organisation-type cards side by side, each with its count.
 *
 * An **async server component**; the counts come from the page's one fetch.
 */
export async function OrganizationTypes({ stats }: OrganizationTypesProps) {
  const t = await getTranslations("organizations");

  const types: OrgType[] = ORG_TYPE_CONFIG.map((org) => ({
    id: org.id,
    icon: org.icon,
    href: org.href,
    label: t(org.labelKey),
    description: t(org.descriptionKey),
    count: stats[org.countKey],
  }));

  return (
    // Three columns, unlike the entity-result grids' two: these are the three
    // fixed navigation cards (leagues / committees / clubs), not a result list.
    <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
      {types.map((org) => (
        <OrganizationTypeCard key={org.id} org={org} />
      ))}
    </Grid>
  );
}
