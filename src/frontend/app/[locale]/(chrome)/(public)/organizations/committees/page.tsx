// src/frontend/app/[locale]/(chrome)/(public)/organizations/committees/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { CommitteesTable } from "@/features/organizations/committees/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The committee and league lists are cached for 24h by
// fetchApi, so a render here is a cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Metadata for the committees listing.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return {
    title: tMeta("committees.label"),
    description: tMeta("committees.description"),
  };
}

async function CommitteesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "organizations" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  const [committees, leagues] = await Promise.all([
    serverCommitteesService.getAll(),
    serverLeaguesService.getAll(),
  ]).catch(handleServerError);
  const regionNames = Object.fromEntries(
    leagues.map((league) => [league.id, league.region.name]),
  );

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("committees.label"), current: true },
        ]}
      />
      <Text variant="pageTitle">
        {tCommon("sectionTitles.departmentalCommittees")}
      </Text>
      <CommitteesTable committees={committees} regionNames={regionNames} />
    </PageLayout>
  );
}

export default withServerErrorState(CommitteesPage);
