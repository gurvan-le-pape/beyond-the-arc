// src/frontend/app/[locale]/(chrome)/(public)/organizations/committees/[committeeId]/page.tsx
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// The image build has no backend to enumerate committees against, so this can
// only ever return an empty list — but it has to be exported anyway. Upstream:
// "You must always return an array from generateStaticParams, even if it's
// empty. Otherwise, the route will be dynamically rendered." Without it the
// `revalidate` below is dead config and every request runs a full server
// render, which is what the four sibling detail routes avoid by doing this.
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: LocalePageProps<{ committeeId: string }>): Promise<Metadata> {
  const { committeeId: committeeIdStr, locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  const committee = await serverCommitteesService
    .getById(parseRouteId(committeeIdStr))
    .catch(handleServerError);

  return {
    title: committee.name,
    description: tMeta("committeeMeta", { name: committee.name }),
  };
}

export default async function CommitteePage({
  params,
}: LocalePageProps<{ committeeId: string }>) {
  const { committeeId: committeeIdStr, locale } = await params;
  setRequestLocale(locale);

  const committeeId = parseRouteId(committeeIdStr);

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  const [committee, { items: championships }, { items: clubs }] =
    await Promise.all([
      serverCommitteesService.getById(committeeId),
      serverChampionshipsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        id: committeeId,
      }),
      serverClubsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId,
      }),
    ]).catch(handleServerError);

  return (
    <PageLayout>
      <OrganizationDetailView
        breadcrumb={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("committees.label"),
            href: "/organizations/committees",
          },
          { label: committee.name, current: true },
        ]}
        header={{ name: committee.name, imageFolder: "committees" }}
        info={{
          president: committee.president,
          address: committee.address,
          email: committee.email,
          phone: committee.phone,
        }}
        chipList={{
          items: clubs,
          title: tCommon("sectionTitles.clubs"),
          searchPlaceholder: tCommon("searchPlaceholder"),
          basePath: "/organizations/clubs",
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
