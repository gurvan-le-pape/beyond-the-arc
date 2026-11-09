// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { committeesService } from "@/features/organizations/committees/api";
import { leaguesService } from "@/features/organizations/leagues/api";
import { LeaguesOverview } from "@/features/organizations/leagues/components";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The league list is cached for 24h by `request`, so a render
// here is a cache read, not a query. So is the committee list, read only to
// count each league's committees.
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

  const [leagues, committees] = await Promise.all([
    leaguesService.getAll(),
    committeesService.getAll(),
  ]).catch(handleServerError);
  const committeeCounts: Record<number, number> = {};
  for (const committee of committees) {
    committeeCounts[committee.leagueId] =
      (committeeCounts[committee.leagueId] ?? 0) + 1;
  }
  const clubCount = leagues.reduce((sum, league) => sum + league.clubCount, 0);

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("leagues.label"), current: true },
        ]}
      />
      <div className="space-y-1">
        <Text variant="pageTitle">
          {tCommon("sectionTitles.regionalLeagues")}
        </Text>
        <Text variant="caption" as="p">
          {t("leagues.summary", {
            leagues: leagues.length,
            clubs: clubCount,
          })}
        </Text>
      </div>
      <LeaguesOverview leagues={leagues} committeeCounts={committeeCounts} />
    </PageLayout>
  );
}

export default withServerErrorState(LeaguesPage);
