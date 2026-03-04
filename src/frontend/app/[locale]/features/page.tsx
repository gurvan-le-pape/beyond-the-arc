// src/frontend/app/[locale]/features/page.tsx
import {
  BarChart3,
  Calendar,
  Clock,
  Globe2,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

import { Footer, Header } from "@/shared/components/layouts";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  const features = [
    {
      icon: Trophy,
      title: t("features.leaderboards.title"),
      description: t("features.leaderboards.description"),
      status: "live",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Clock,
      title: t("features.matchSummary.title"),
      description: t("features.matchSummary.description"),
      status: "live",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Target,
      title: t("features.shotCharts.title"),
      description: t("features.shotCharts.description"),
      status: "live",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: t("features.playerComparison.title"),
      description: t("features.playerComparison.description"),
      status: "live",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      title: t("features.clubsMap.title"),
      description: t("features.clubsMap.description"),
      status: "live",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Users,
      title: t("features.teamRosters.title"),
      description: t("features.teamRosters.description"),
      status: "live",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Calendar,
      title: t("features.matchSchedule.title"),
      description: t("features.matchSchedule.description"),
      status: "live",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: t("features.liveStats.title"),
      description: t("features.liveStats.description"),
      status: "coming-soon",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Zap,
      title: t("features.liveUpdates.title"),
      description: t("features.liveUpdates.description"),
      status: "coming-soon",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: t("features.userAccounts.title"),
      description: t("features.userAccounts.description"),
      status: "planned",
      color: "from-gray-500 to-gray-700",
    },
  ];

  const highlights = [
    {
      icon: Globe2,
      title: t("features.highlights.i18n.title"),
      description: t("features.highlights.i18n.description"),
    },
    {
      icon: Search,
      title: t("features.highlights.search.title"),
      description: t("features.highlights.search.description"),
    },
    {
      icon: Sparkles,
      title: t("features.highlights.responsive.title"),
      description: t("features.highlights.responsive.description"),
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
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-title md:text-display font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("features.title")}
            </h1>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const statusColors = {
                live: "bg-success-light/20 dark:bg-success-dark/20 text-success-dark dark:text-success-light border border-success-DEFAULT/30",
                "coming-soon":
                  "bg-info-light/20 dark:bg-info-dark/20 text-info-dark dark:text-info-light border border-info-DEFAULT/30",
                planned:
                  "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
              };

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${feature.color} text-white shadow-sm`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-button text-caption font-medium ${
                        statusColors[
                          feature.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {t(`features.status.${feature.status}`)}
                    </span>
                  </div>
                  <h3 className="text-body-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-body-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Highlights Section */}
          <div className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark p-8">
            <h2 className="text-subtitle font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              {t("features.highlightsTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highlights.map((highlight, idx) => {
                const Icon = highlight.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
