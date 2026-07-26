// src/frontend/app/[locale]/(chrome)/layout.tsx
import { Footer, Header, SkipLink } from "@/shared/components/layout";

/**
 * Site chrome — header, footer and the page background — for every route
 * except the full-viewport map.
 *
 * This lives in a layout rather than in `PageLayout` so that anything Next
 * renders *instead of* a page still renders inside the shell: `error.tsx`,
 * `not-found.tsx` and any future `loading.tsx`. Pages contribute only their
 * `<main>`, which `PageLayout` provides.
 */
export default function ChromeLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen surface-base">
      <SkipLink />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
