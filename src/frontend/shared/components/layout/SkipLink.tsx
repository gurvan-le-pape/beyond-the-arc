// src/frontend/shared/components/layout/SkipLink.tsx
"use client";

import { useTranslations } from "next-intl";

/**
 * First focusable element on every page: jumps past the header's navigation to
 * the `main` landmark, which `PageLayout` marks with `id="main-content"`.
 *
 * Visually hidden until it takes focus — `sr-only` until `focus:not-sr-only` —
 * so it costs sighted users nothing and saves keyboard users the same eight
 * nav links on every navigation.
 */
export const SkipLink = () => {
  const t = useTranslations("navigation");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-button focus:bg-primary focus:text-white focus-ring"
    >
      {t("header.skipToContent")}
    </a>
  );
};

export default SkipLink;
