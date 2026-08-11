// src/frontend/features/site/product/constants/productHighlights.ts
import { Globe2, Search, Sparkles } from "lucide-react";

/**
 * The cross-cutting qualities shown below the capability grid, in display
 * order. Copy is resolved by the page from `landing.product.highlights.*`.
 */
export const PRODUCT_HIGHLIGHTS = [
  { icon: Globe2, highlightKey: "i18n" },
  { icon: Search, highlightKey: "search" },
  { icon: Sparkles, highlightKey: "responsive" },
] as const;
