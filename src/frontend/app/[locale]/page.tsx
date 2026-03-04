// src/frontend/app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

import { Footer, Header } from "@/shared/components/layouts";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-700 dark:text-primary-300 leading-tight">
            {t("homepage.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {t("homepage.subtitle")}
          </p>
          <div className="pt-4">
            <a
              href={`/${locale}/features`}
              className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-4 px-10 rounded-button shadow-card hover:shadow-card-hover transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-105"
            >
              {t("homepage.cta")}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
