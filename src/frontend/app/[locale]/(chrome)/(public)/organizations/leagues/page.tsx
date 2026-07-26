// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TitleSection } from "@/features/organizations/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api";
import { LeaguesGrid } from "@/features/organizations/leagues/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Rendered per request: the image build has no backend to prerender against.
// The league list itself is cached for 24h by fetchApi, so a render here is a
// cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Leagues Page
 * Shows all regional leagues
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return { title: tMeta("leagues.label"), description: tMeta("leagues.description") };
}

export default async function LeaguesPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const leagues = await serverLeaguesService.getAll().catch(handleServerError);

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("leagues.label"), current: true },
        ]}
      />
      <TitleSection
        viewLevel={ViewLevel.REGION}
        selectedLeague={null}
        selectedCommittee={null}
      />
      <LeaguesGrid leagues={leagues} />
    </PageLayout>
  );
}
