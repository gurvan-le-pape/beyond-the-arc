// src/frontend/app/[locale]/(public)/organizations/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  OrganizationsGrid,
  OrganizationsHeader,
  OrganizationsStats,
} from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Divide } from "@/shared/components/primitives";
import type { LocalePageProps } from "@/shared/types";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

export default async function OrganizationsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  return (
    <PageLayout
      centered
      contentClassName="max-w-4xl items-center flex flex-col gap-8"
    >
      <OrganizationsHeader t={t} />
      <OrganizationsStats t={t} />
      <Divide />
      <OrganizationsGrid t={t} />
    </PageLayout>
  );
}
