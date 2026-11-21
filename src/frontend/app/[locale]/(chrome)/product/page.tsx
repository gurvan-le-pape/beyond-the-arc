// src/frontend/app/[locale]/(chrome)/product/page.tsx
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ProductFeatures,
  ProductHighlights,
} from "@/features/site/product/components";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the product page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return {
    title: tMeta("product.title"),
    description: tMeta("product.subtitle"),
  };
}

/**
 * The product page: the feature grid and the highlights beneath it.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values.
 */
export default async function ProductPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  return (
    <PageLayout>
      <PageHero
        title={t("product.title")}
        lead={t("product.subtitle")}
        icon={Sparkles}
      />

      <ProductFeatures />
      <ProductHighlights />
    </PageLayout>
  );
}
