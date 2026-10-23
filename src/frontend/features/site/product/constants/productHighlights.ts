// src/frontend/features/site/product/constants/productHighlights.ts
import { Globe2, MonitorSmartphone, SunMoon } from "lucide-react";

/**
 * The cross-cutting qualities shown below the capability grid, in display
 * order. Copy is resolved by the page from `landing.product.highlights.*`.
 */
export const PRODUCT_HIGHLIGHTS = [
  { icon: Globe2, highlightKey: "i18n" },
  { icon: SunMoon, highlightKey: "themes" },
  { icon: MonitorSmartphone, highlightKey: "responsive" },
] as const;
