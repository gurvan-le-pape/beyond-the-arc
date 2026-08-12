// src/frontend/app/[locale]/(chrome)/(public)/organizations/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  OrganizationsGrid,
  OrganizationsHeader,
  OrganizationsStats,
} from "@/features/organizations/components";
import type { OrganizationCounts } from "@/features/organizations/types";
import { serverStatsService } from "@/features/stats/api/stats.server";
import { PageLayout } from "@/shared/components/layout";
import { Divide } from "@/shared/components/primitives";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Rendered per request: the image build has no backend to prerender against.
// The counts themselves are cached by fetchApi, so a render here is a cache
// read, not a query.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return { title: tMeta("title"), description: tMeta("subtitle") };
}

export default async function OrganizationsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // One fetch for both render sites: the stats band and the three cards showed
  // the same three numbers from two hardcoded copies, and all six were wrong.
  const stats = await serverStatsService.getStats().catch(handleServerError);
  const counts: OrganizationCounts = {
    leagues: stats.leagues,
    committees: stats.committees,
    clubs: stats.clubs,
  };

  return (
    <PageLayout centered contentClassName="max-w-4xl">
      <OrganizationsHeader />
      <OrganizationsStats counts={counts} />
      <Divide />
      <OrganizationsGrid counts={counts} />
    </PageLayout>
  );
}
