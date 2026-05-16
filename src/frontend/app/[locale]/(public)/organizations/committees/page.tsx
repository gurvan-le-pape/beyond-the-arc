// src/frontend/app/[locale]/(public)/organizations/committees/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverCommitteesService } from "@/features/organizations/committees/api";
import { CommitteesGrid } from "@/features/organizations/committees/components/list/CommitteesGrid";
import { TitleSection } from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

/**
 * Committees Page
 * Shows all departmental committees
 * Strategy: ISR with 24-hour revalidation
 */
export default async function CommitteesPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  const committees = await serverCommitteesService.getAll();

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("breadcrumb"), href: "/organizations" },
          { label: t("committees.label"), current: true },
        ]}
      />
      <TitleSection
        viewLevel={ViewLevel.DEPARTMENT}
        selectedLeague={null}
        selectedCommittee={null}
      />
      <CommitteesGrid committees={committees} />
    </PageLayout>
  );
}
