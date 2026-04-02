// src/frontend/shared/constants/organization-types.ts
export const OrganizationType = {
  LEAGUES: "leagues",
  COMMITTEES: "committees",
  CLUBS: "clubs",
} as const;

export const ORGANIZATION_TYPE_LIST = Object.values(OrganizationType);
export type OrganizationType = (typeof ORGANIZATION_TYPE_LIST)[number];
