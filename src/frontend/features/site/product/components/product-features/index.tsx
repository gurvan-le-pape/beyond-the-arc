// src/frontend/features/site/product/components/product-features/index.tsx
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";

import { PRODUCT_FEATURES } from "../../constants/productFeatures";
import { FeatureCard } from "./FeatureCard";

/**
 * What the site lets you look up, one card per capability, in
 * `PRODUCT_FEATURES` order. Each card's copy comes from
 * `landing.product.<featureKey>`.
 */
export function ProductFeatures() {
  const t = useTranslations("landing.product");

  return (
    <div className="mb-12">
      <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {PRODUCT_FEATURES.map((feature) => (
          <FeatureCard
            key={feature.featureKey}
            icon={feature.icon}
            title={t(`${feature.featureKey}.title`)}
            description={t(`${feature.featureKey}.description`)}
          />
        ))}
      </Grid>
    </div>
  );
}
