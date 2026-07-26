// src/frontend/app/[locale]/(chrome)/(public)/organizations/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  OrganizationsGrid,
  OrganizationsHeader,
  OrganizationsStats,
} from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Divide } from "@/shared/components/primitives";
import type { LocalePageProps } from "@/shared/types";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return { title: tMeta("title"), description: tMeta("subtitle") };
}

export default async function OrganizationsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "organizations" });

  return (
    <PageLayout centered contentClassName="max-w-4xl">
      <OrganizationsHeader t={t} />
      <OrganizationsStats t={t} />
      <Divide />
      <OrganizationsGrid t={t} />
    </PageLayout>
  );
}
