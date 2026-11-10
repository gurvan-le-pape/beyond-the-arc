// src/frontend/app/[locale]/(fullscreen)/layout.tsx
import { QuickSearch } from "@/features/search/components";
import { Header, SkipLink } from "@/shared/components/layout";

interface FullscreenLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * Chrome for routes that fill the viewport: header only, no footer, and the
 * page pinned to the screen height so the content below can take the rest.
 *
 * Only the clubs map uses it — it is a map application, not a document, and a
 * footer under it would either be unreachable or shrink the map. Everything
 * else belongs in `(chrome)`.
 */
export default function FullscreenLayout({ children }: FullscreenLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden surface-base">
      <SkipLink />
      <Header search={<QuickSearch />} />
      {children}
    </div>
  );
}
