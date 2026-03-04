// src/frontend/features/organizations/clubs/hooks/useBreadcrumbs.tsx
import { useTranslations } from "next-intl";

import type { BreadcrumbItem } from "../components";

interface ClubsBreadcrumbParams {
  league?: { id: number; name: string };
  committee?: { id: number; name: string };
  club?: { id: number; name: string };
  current?: string;
}

export function useClubsBreadcrumbs(
  params: ClubsBreadcrumbParams,
): BreadcrumbItem[] {
  const t = useTranslations("clubs");
  const items: BreadcrumbItem[] = [];

  // Home - always present
  items.push({
    label: t("france"),
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
