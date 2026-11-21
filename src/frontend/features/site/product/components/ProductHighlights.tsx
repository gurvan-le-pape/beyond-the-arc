// src/frontend/features/site/product/components/ProductHighlights.tsx
import { useTranslations } from "next-intl";

import { Card, Grid } from "@/shared/components/primitives";

import { PRODUCT_HIGHLIGHTS } from "../constants/productHighlights";
import { FeatureHighlightItem } from "./FeatureHighlightItem";

/**
 * “Also on the site”: the qualities that hold on every page rather than
 * belonging to one feature — two languages, three themes, any screen width.
 * Copy comes from `landing.product.highlights`.
 */
export function ProductHighlights() {
  const t = useTranslations("landing.product");

  return (
    <Card padding="lg" heading={t("highlightsTitle")}>
      <Grid columns={{ base: 1, md: 3 }} gap={6}>
        {PRODUCT_HIGHLIGHTS.map((item) => (
          <FeatureHighlightItem
            key={item.highlightKey}
            icon={item.icon}
            title={t(`highlights.${item.highlightKey}.title`)}
            description={t(`highlights.${item.highlightKey}.description`)}
          />
        ))}
      </Grid>
    </Card>
  );
}
