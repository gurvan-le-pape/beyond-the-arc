// src/frontend/app/[locale]/(chrome)/layout.tsx
import { setRequestLocale } from "next-intl/server";

import { QuickSearch } from "@/features/search/components";
import { Footer, Header, SkipLink } from "@/shared/components/layout";

interface ChromeLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/**
 * Site chrome — header, footer and the page background — for every route
 * except the full-viewport map.
 *
 * This lives in a layout rather than in `PageLayout` so that anything Next
 * renders *instead of* a page still renders inside the shell: `error.tsx`,
 * `not-found.tsx` and any future `loading.tsx`. Pages contribute only their
 * `<main>`, which `PageLayout` provides.
 *
 * **It calls `setRequestLocale` itself.** The header renders next-intl server
 * code (the logo's name), and Next renders each layout and page as its own
 * segment, so the locale set by `[locale]/layout.tsx` is not guaranteed to be
 * there yet. Without it next-intl falls back to `headers()`, which throws
 * `DYNAMIC_SERVER_USAGE` on every revalidated detail page.
 */
export default async function ChromeLayout({
  children,
  params,
}: ChromeLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen surface-base">
      <SkipLink />
      <Header search={<QuickSearch />} />
      {children}
      <Footer />
    </div>
  );
}
