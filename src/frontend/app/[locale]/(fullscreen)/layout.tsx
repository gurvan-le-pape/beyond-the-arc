// src/frontend/app/[locale]/(fullscreen)/layout.tsx
import { Header } from "@/shared/components/layout";

/**
 * Chrome for routes that fill the viewport: header only, no footer, and the
 * page pinned to the screen height so the content below can take the rest.
 *
 * Only the clubs map uses it — it is a map application, not a document, and a
 * footer under it would either be unreachable or shrink the map. Everything
 * else belongs in `(chrome)`.
 */
export default function FullscreenLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden surface-base">
      <Header />
      {children}
    </div>
  );
}
