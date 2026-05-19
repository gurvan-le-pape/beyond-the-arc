// src/frontend/app/[locale]/(public)/organizations/leagues/[leagueId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { ChampionshipList } from "@/features/competitions/championships/components";
import { serverCommitteesService } from "@/features/organizations/committees/api";
import {
  OrganizationHeader,
  OrganizationInfo,
  SearchableChipList,
} from "@/features/organizations/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { CompetitionLevel } from "@/shared/constants";

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

export default async function RegionalChampionshipsPage({
  params,
}: LeaguePageProps) {
  const { leagueId: leagueIdStr, locale } = await params;
  setRequestLocale(locale);

  const leagueId = Number.parseInt(leagueIdStr, 10);
  if (Number.isNaN(leagueId) || leagueId <= 0) notFound();

  const tCommon = await getTranslations({ locale, namespace: "common" });
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
  ]);

  if (!league) notFound();

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    { label: tOrganizations("leagues.label"), href: "/organizations/leagues" },
    { label: league.name, current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-6">
        {/* Organization Header */}
        <OrganizationHeader name={league.name} imageFolder="leagues" />

        {/* Organization info */}
        <OrganizationInfo
          president={league.president}
          address={league.address}
          email={league.email}
          phone={league.phone}
        />

        {/* Committees */}
        <SearchableChipList
          items={committees}
          title={tCommon("sectionTitles.departmentalCommittees")}
          searchPlaceholder={tCommon("searchPlaceholder")}
          basePath="/organizations/committees"
          showSearch={false}
        />

        {/* Championships */}
        <ChampionshipList championships={championships} />
      </div>
    </PageLayout>
  );
}
