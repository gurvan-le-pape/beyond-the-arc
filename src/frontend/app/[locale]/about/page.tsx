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

import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";

export default async function AboutPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

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
    <PageLayout>
      {/* Header */}
      <div className="text-center mb-12">
        {/* Decorative icon — gradient is intentional, not a surface */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-card">
          <Target className="w-8 h-8" />
        </div>
        <Text variant="h1" className="mb-4">
          {t("about.title")}
        </Text>
        <Text variant="lead" className="max-w-3xl mx-auto">
          {t("about.intro")}
        </Text>
      </div>

      {/* Engineering Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <div
              key={principle.title}
              className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 p-6"
            >
              {/* Decorative gradient icon — intentional, stays as raw Tailwind */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${principle.color} text-white mb-4 shadow-sm`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <Text variant="h3" className="mb-2">
                {principle.title}
              </Text>
              <Text variant="caption">{principle.description}</Text>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-card shadow-card dark:shadow-card-dark p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-4">{t("about.exploreTitle")}</h2>
        <p className="text-sm mb-6 max-w-2xl mx-auto">{t("about.explore")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`/${locale}/features`}
            className="px-6 py-3 bg-white text-primary-600 rounded-button font-semibold hover:bg-surface-subtle transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
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
    </PageLayout>
  );
}
