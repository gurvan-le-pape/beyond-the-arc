// src/frontend/app/[locale]/(public)/organizations/leagues/[leagueId]/page.tsx
import { Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { serverCommitteesService } from "@/features/organizations/committees/api";
import { serverLeaguesService } from "@/features/organizations/leagues/api";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";
import { handleServerError, parseRouteId } from "@/shared/utils";

interface LeaguePageProps {
  readonly params: Promise<{ locale: string; leagueId: string }>;
}

export async function generateStaticParams() {
  try {
    const leagues = await serverLeaguesService.getAll();
    return leagues.map((l) => ({ leagueId: String(l.id) }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function LeaguePage({ params }: LeaguePageProps) {
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
