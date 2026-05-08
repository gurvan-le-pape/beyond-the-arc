// src/frontend/app/[locale]/(public)/organizations/clubs/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClubsView } from "@/features/organizations/clubs/components/list/ClubsView";
import { TitleSection } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

/**
 * Clubs Page
 * Shows all clubs
 * Strategy: ISR with 24-hour revalidation
 */
export default async function ClubsPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("clubs.label"), current: true },
        ]}
      />
      <TitleSection
        viewLevel={ViewLevel.CLUBS}
        selectedLeague={null}
        selectedCommittee={null}
      />
      <ClubsView />
    </PageLayout>
  );
}
