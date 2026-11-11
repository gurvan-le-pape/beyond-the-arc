// src/frontend/app/[locale]/(fullscreen)/layout.tsx
import { setRequestLocale } from "next-intl/server";

import { QuickSearch } from "@/features/search/components";
import { Header, SkipLink } from "@/shared/components/layout";

interface FullscreenLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/**
 * Chrome for routes that fill the viewport: header only, no footer, and the
 * page pinned to the screen height so the content below can take the rest.
 *
 * Only the clubs map uses it — it is a map application, not a document, and a
 * footer under it would either be unreachable or shrink the map. Everything
 * else belongs in `(chrome)`.
 *
 * **It calls `setRequestLocale` itself.** The header renders next-intl server
 * code (the logo's name), and Next renders each layout and page as its own
 * segment, so the locale set by `[locale]/layout.tsx` is not guaranteed to be
 * there yet. Without it next-intl falls back to `headers()`, which throws
 * `DYNAMIC_SERVER_USAGE` on every revalidated detail page.
 */
export default async function FullscreenLayout({
  children,
  params,
}: FullscreenLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col h-screen overflow-hidden surface-base">
      <SkipLink />
      <Header search={<QuickSearch />} />
      {children}
    </div>
  );
}
