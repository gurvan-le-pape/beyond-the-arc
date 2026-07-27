// src/frontend/features/competitions/championships/types/ChampionshipNavLink.ts

/**
 * One destination in the championship detail nav — a sibling championship
 * reachable by changing a single facet (its category, or its division).
 *
 * The builders in `utils/` resolve the facet to a concrete championship id and
 * hand back links, so the component that renders them needs no lookup table and
 * no router.
 */
export interface ChampionshipNavLink {
  readonly label: string;
  readonly href: string;
  readonly isCurrent: boolean;
}
