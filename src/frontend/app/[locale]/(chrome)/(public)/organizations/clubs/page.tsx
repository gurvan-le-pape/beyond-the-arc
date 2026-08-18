// src/frontend/app/[locale]/(chrome)/(public)/organizations/clubs/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClubsView } from "@/features/organizations/clubs/components";
import { TitleSection } from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the clubs listing.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  return {
    title: tMeta("clubs.label"),
    description: tMeta("clubs.description"),
  };
}

/**
 * The clubs listing.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values. Fetches nothing server-side — `ClubsView` is a client component on TanStack Query — so this shell prerenders as static.
 */
export default async function ClubsPage({ params }: LocalePageProps) {
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
      <TitleSection viewLevel={ViewLevel.CLUBS} />
      <ClubsView />
    </PageLayout>
  );
}
