// src/frontend/app/[locale]/(chrome)/docs/layout.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { LocalePageProps } from "@/shared/types";

/**
 * This segment exists only to carry the docs page's metadata. The page itself
 * is a client component — it is an accordion from top to bottom — and a client
 * component cannot export `generateMetadata`.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return { title: tMeta("docs.title"), description: tMeta("docs.intro") };
}

export default function DocsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return children;
}
