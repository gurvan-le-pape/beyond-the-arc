// src/frontend/app/[locale]/layout.tsx
import "@/styles/globals.css";
import "@/styles/map.css";

import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { Providers } from "../providers";

const locales = ["en", "fr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
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
          <Providers>
            <div className="min-h-screen flex flex-col">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
