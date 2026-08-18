// src/frontend/app/[locale]/layout.tsx
import "@/styles/globals.css";
import "@/styles/map.css";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { LOCALES } from "@/locales";

import { Providers } from "../providers";

/**
 * The locales to pre-build.
 *
 * Unlike the detail routes' empty arrays, this one is populated: the locale set
 * is known at build time and does not depend on the backend, so every locale's
 * shell is generated ahead of time.
 *
 * @returns one entry per configured locale
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/**
 * The root of every localised route: sets the request locale and provides the
 * message catalogue.
 *
 * **`setRequestLocale` must run before any other next-intl call** in the render,
 * which is why it happens here rather than in the pages. It is also what keeps
 * routes statically renderable — reading the locale from headers instead would
 * force every page dynamic.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!(LOCALES as readonly string[]).includes(locale)) {
    notFound();
  }

  // next-intl's documented setup. Without it every server API call falls back
  // to reading headers(), which opts the whole subtree out of prerendering —
  // pages that could be static were rendering per request instead. Pages that
  // genuinely must render per request say so with `dynamic = "force-dynamic"`.
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
