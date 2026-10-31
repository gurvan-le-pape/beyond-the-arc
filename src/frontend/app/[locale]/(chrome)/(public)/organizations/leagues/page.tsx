// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { leaguesService } from "@/features/organizations/leagues/api";
import { LeaguesGrid } from "@/features/organizations/leagues/components";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The league list is cached for 24h by `request`, so a render
// here is a cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Metadata for the leagues listing.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return {
    title: tMeta("leagues.label"),
    description: tMeta("leagues.description"),
  };
}

async function LeaguesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "organizations" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const leagues = await leaguesService.getAll().catch(handleServerError);

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("leagues.label"), current: true },
        ]}
      />
      <Text variant="pageTitle">
        {tCommon("sectionTitles.regionalLeagues")}
      </Text>
      <LeaguesGrid leagues={leagues} />
    </PageLayout>
  );
}

export default withServerErrorState(LeaguesPage);
