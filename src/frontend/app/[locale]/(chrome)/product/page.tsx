// src/frontend/app/[locale]/(chrome)/product/page.tsx
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  FeatureCard,
  FeaturesHighlightsSection,
  type HighlightItem,
} from "@/features/site/product/components";
import {
  PRODUCT_FEATURES,
  PRODUCT_HIGHLIGHTS,
} from "@/features/site/product/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Grid } from "@/shared/components/primitives";
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

  const features = PRODUCT_FEATURES.map((f) => ({
    icon: f.icon,
    title: t(`product.${f.featureKey}.title`),
    description: t(`product.${f.featureKey}.description`),
  }));

  const highlights: HighlightItem[] = PRODUCT_HIGHLIGHTS.map((h) => ({
    icon: h.icon,
    title: t(`product.highlights.${h.highlightKey}.title`),
    description: t(`product.highlights.${h.highlightKey}.description`),
  }));

  return (
    <PageLayout>
      <PageHero
        title={t("product.title")}
        lead={t("product.subtitle")}
        icon={Sparkles}
      />

      {/* Features Grid — cards sit on surface-base, establish surface-subtle context */}
      <div className="mb-12">
        <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </Grid>
      </div>

      <FeaturesHighlightsSection
        title={t("product.highlightsTitle")}
        highlights={highlights}
      />
    </PageLayout>
  );
}
