// src/frontend/app/[locale]/(public)/organizations/leagues/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TitleSection } from "@/features/organizations/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api";
import { LeaguesGrid } from "@/features/organizations/leagues/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

/**
 * Leagues Page
 * Shows all regional leagues
 * Strategy: ISR with 24-hour revalidation
 */
export default async function LeaguesPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const leagues = await serverLeaguesService.getAll();

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
