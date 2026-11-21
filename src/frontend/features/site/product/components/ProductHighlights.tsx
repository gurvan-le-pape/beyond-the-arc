// src/frontend/features/site/product/components/ProductHighlights.tsx
import { Globe2, MonitorSmartphone, SunMoon } from "lucide-react";
import { useTranslations } from "next-intl";

import { IconHighlight } from "@/shared/components/blocks";
import { Card, Grid } from "@/shared/components/primitives";

/**
 * The cross-cutting qualities shown below the capability grid, in display
 * order. Copy is resolved from `landing.product.highlights.*`.
 */
const PRODUCT_HIGHLIGHTS = [
  { icon: Globe2, highlightKey: "i18n" },
  { icon: SunMoon, highlightKey: "themes" },
  { icon: MonitorSmartphone, highlightKey: "responsive" },
] as const;

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
          <IconHighlight
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
