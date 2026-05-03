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

import { PageHero, PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";

export default async function FeaturesPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

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

  // planned uses bg-surface-inset so it resolves correctly regardless of
  // which surface the card sits on — no hardcoded elevation level needed
  const statusColors = {
    live: "bg-success-subtle text-success-strong border border-success/30",
    "coming-soon": "bg-info-subtle text-info-strong border border-info/30",
    planned: "bg-surface-inset text-text-emphasis border border-divide",
  };

  return (
    <PageLayout>
      <PageHero
        title={t("features.title")}
        lead={t("features.subtitle")}
        icon={Sparkles}
      />

      {/* Features Grid — cards sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                {/* Feature icon — decorative gradient, intentional */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${feature.color} text-white shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`px-2 py-1 rounded-button text-xs font-medium ${
                    statusColors[feature.status as keyof typeof statusColors]
                  }`}
                >
                  {t(`features.status.${feature.status}`)}
                </span>
              </div>
              <Text variant="h3" className="mb-2">
                {feature.title}
              </Text>
              <Text variant="caption">{feature.description}</Text>
            </div>
          );
        })}
      </div>

      {/* Highlights Section — sits on surface-base, establishes surface-subtle context */}
      <div className="surface-subtle rounded-card border border-divide shadow-card p-8">
        <Text variant="h2" className="mb-6 text-center text-xl">
          {t("features.highlightsTitle")}
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <div key={highlight.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-primary-subtle text-primary-600 mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <Text variant="h3" className="mb-2 text-base">
                  {highlight.title}
                </Text>
                <Text variant="caption">{highlight.description}</Text>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
