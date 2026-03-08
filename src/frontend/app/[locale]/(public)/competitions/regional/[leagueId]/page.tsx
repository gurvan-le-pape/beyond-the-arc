// src/frontend/app/[locale]/(public)/competitions/regional/[leagueId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  CompetitionsPageSkeleton,
  HorizontalCarousel,
} from "@/features/competitions/components";
import ChampionshipList from "@/features/competitions/components/championships/ChampionshipList";
import { useRegionalChampionshipsData } from "@/features/competitions/hooks/useRegionalChampionships";
import { useRouter } from "@/navigation";
import { Footer, Header } from "@/shared/components/layouts";
import { Breadcrumb } from "@/shared/components/navigation";
import { Card, ErrorMessage } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import {
  groupChampionshipsByCategory,
  groupChampionshipsByGender,
} from "@/shared/utils/grouping";

export default function RegionalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.leagueId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, league, leagues, committees, isLoading, error } =
    useRegionalChampionshipsData(id);

  const championshipsByGender = groupChampionshipsByGender(championships);

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    {
      label: tCompetitions("regional.label"),
      href: `/competitions/${CompetitionLevel.REGIONAL}`,
    },
    { label: league?.name ?? "…", current: true },
  ];

  let body: React.ReactNode;

  if (error) {
    body = <ErrorMessage message={error.message} />;
  } else if (isLoading) {
    body = <CompetitionsPageSkeleton />;
  } else {
    body = (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* League header strip */}
        {league && (
          <Card variant="highlighted" padding="lg">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {league.name}
            </h1>
          </Card>
        )}

        {/* Leagues carousel */}
        <HorizontalCarousel
          items={leagues}
          title={tCommon("sectionTitles.regionalLeagues")}
          imageFolder="leagues"
          basePath={`/competitions/${CompetitionLevel.REGIONAL}`}
          currentId={id}
          enableSearch={true}
          enableLetterFilter={true}
        />

        {/* Committees carousel */}
        <HorizontalCarousel
          items={committees}
          title={tCommon("sectionTitles.departmentalCommittees")}
          imageFolder="committees"
          basePath={`/competitions/${CompetitionLevel.DEPARTMENTAL}`}
          enableSearch={true}
          enableLetterFilter={true}
        />

        {/* Championships */}
        <ChampionshipList
          championshipsByGender={championshipsByGender}
          groupChampionshipsByCategory={groupChampionshipsByCategory}
          onItemClick={(championship) =>
            router.push(
              `/competitions/${CompetitionLevel.REGIONAL}/${id}/${championship.id}`,
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        {body}
      </main>
      <Footer />
    </div>
  );
}
