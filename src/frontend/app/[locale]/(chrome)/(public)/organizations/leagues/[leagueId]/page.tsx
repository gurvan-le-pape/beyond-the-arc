// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/[leagueId]/page.tsx
import { Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { serverCommitteesService } from "@/features/organizations/committees/api";
import { serverLeaguesService } from "@/features/organizations/leagues/api";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// No generateStaticParams: the image build has no backend to enumerate leagues
// against, so it could only ever return an empty list. Each page is generated
// on first request instead and then cached for the revalidate window.
export const dynamicParams = true;
export const revalidate = 3600;

export default async function LeaguePage({
  params,
}: LocalePageProps<{ leagueId: string }>) {
  const { leagueId: leagueIdStr, locale } = await params;
  setRequestLocale(locale);

  const leagueId = parseRouteId(leagueIdStr);

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  const [league, { items: championships }, committees] = await Promise.all([
    serverLeaguesService.getById(leagueId),
    serverChampionshipsService.getAll({
      level: CompetitionLevel.REGIONAL,
      id: leagueId,
    }),
    serverCommitteesService.getAll({ leagueId }),
  ]).catch(handleServerError);

  return (
    <PageLayout>
      <OrganizationDetailView
        breadcrumb={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("leagues.label"),
            href: "/organizations/leagues",
          },
          { label: league.name, current: true },
        ]}
        header={{ name: league.name, imageFolder: "leagues" }}
        info={{
          president: league.president,
          address: league.address,
          email: league.email,
          phone: league.phone,
        }}
        chipList={{
          items: committees,
          title: tCommon("sectionTitles.departmentalCommittees"),
          searchPlaceholder: tCommon("searchPlaceholder"),
          basePath: "/organizations/committees",
          showSearch: false,
        }}
        section={{
          items: championships.map((c) => ({ type: "championship", data: c })),
          title: tCompetitions("championshipsSectionTitle"),
          emptyState: (
            <EmptyState
              icon={<Trophy className="w-16 h-16" />}
              title={tCompetitions("noChampionships")}
            />
          ),
        }}
      />
    </PageLayout>
  );
}
