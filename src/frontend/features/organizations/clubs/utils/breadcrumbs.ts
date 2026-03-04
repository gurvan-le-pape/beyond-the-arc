// src/frontend/features/organizations/clubs/utils/breadcrumbs.ts
import type { BreadcrumbItem } from "../components";

interface ClubsBreadcrumbParams {
  league?: { id: number; name: string };
  committee?: { id: number; name: string };
  club?: { id: number; name: string };
  current?: string;
}

/**
 * Generate breadcrumb items for clubs pages (server-safe)
 * This is a pure function that can be used in server components
 */
export function getBreadcrumbItems(
  params: ClubsBreadcrumbParams,
  translations: { france: string },
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // Home - always present
  items.push({
    label: translations.france,
    href: "/clubs",
  });

  // League level
  if (params.league) {
    items.push({
      label: params.league.name,
      href: `/clubs/league/${params.league.id}`,
    });
  }

  // Committee level
  if (params.committee && params.league) {
    items.push({
      label: params.committee.name,
      href: `/clubs/league/${params.league.id}/committee/${params.committee.id}`,
    });
  }

  // Club level
  if (params.club) {
    items.push({
      label: params.club.name,
      current: true,
    });
  }

  // Custom current page
  if (params.current && !params.club) {
    items.push({
      label: params.current,
      current: true,
    });
  }

  return items;
}
