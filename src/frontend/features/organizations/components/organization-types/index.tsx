// src/frontend/features/organizations/components/organization-types/index.tsx
import type { Stats } from "@/features/stats/types";
import { Grid } from "@/shared/components/primitives";
import { OrganizationType } from "@/shared/constants";

import { OrganizationTypeCard } from "./OrganizationTypeCard";

/** The three organisation types, in display order. */
const ORGANIZATION_TYPES = [
  OrganizationType.LEAGUES,
  OrganizationType.COMMITTEES,
  OrganizationType.CLUBS,
] as const;

interface OrganizationTypesProps {
  /** The platform stats; only the three organisation counts are read. */
  readonly stats: Pick<Stats, "leagues" | "committees" | "clubs">;
}

/**
 * The three organisation-type cards side by side, each with its count. The
 * counts come from the page's one fetch.
 */
export function OrganizationTypes({ stats }: OrganizationTypesProps) {
  return (
    // Three columns, unlike the entity-result grids' two: these are the three
    // fixed navigation cards (leagues / committees / clubs), not a result list.
    <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
      {ORGANIZATION_TYPES.map((type) => (
        <OrganizationTypeCard key={type} type={type} count={stats[type]} />
      ))}
    </Grid>
  );
}
