// src/frontend/app/[locale]/(chrome)/(public)/organizations/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  OrganizationsHeader,
  OrganizationTypes,
} from "@/features/organizations/components";
import { statsService } from "@/features/stats/api";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The counts are cached by `request`, so a render here is a
// cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Metadata for the organisations landing page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return { title: tMeta("title"), description: tMeta("subtitle") };
}

async function OrganizationsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stats = await statsService.getStats().catch(handleServerError);

  return (
    <PageLayout centered contentClassName="max-w-4xl">
      <OrganizationsHeader />
      <OrganizationTypes stats={stats} />
    </PageLayout>
  );
}

export default withServerErrorState(OrganizationsPage);
