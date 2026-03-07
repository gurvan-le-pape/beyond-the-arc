// src/frontend/app/[locale]/about/page.tsx
import {
  Boxes,
  FileCode2,
  Globe,
  Recycle,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

import { Footer, Header } from "@/shared/components/layouts";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  const principles = [
    {
      icon: Boxes,
      title: t("about.modular.title"),
      description: t("about.modular.description"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileCode2,
      title: t("about.separation.title"),
      description: t("about.separation.description"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Recycle,
      title: t("about.reusability.title"),
      description: t("about.reusability.description"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: t("about.scalability.title"),
      description: t("about.scalability.description"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: t("about.readability.title"),
      description: t("about.readability.description"),
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Globe,
      title: t("about.i18n.title"),
      description: t("about.i18n.description"),
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Wrench,
      title: t("about.tooling.title"),
      description: t("about.tooling.description"),
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-card">
              <Target className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("about.title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("about.intro")}
            </p>
          </div>

          {/* Engineering Principles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {principles.map((principle, idx) => {
              const Icon = principle.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 p-6"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${principle.color} text-white mb-4 shadow-sm`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-card shadow-card dark:shadow-card-dark p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-4">
              {t("about.exploreTitle")}
            </h2>
            <p className="text-body mb-6 max-w-2xl mx-auto">
              {t("about.explore")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`/${locale}/features`}
                className="px-6 py-3 bg-white text-primary-600 rounded-button font-semibold hover:bg-gray-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                {t("about.viewFeatures")}
              </a>
              <a
                href={`/${locale}/architecture`}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-button font-semibold hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                {t("about.viewArchitecture")}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
