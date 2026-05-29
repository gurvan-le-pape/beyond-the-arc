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

import {
  FeatureCard,
  FeaturesHighlightsSection,
  type HighlightItem,
} from "@/features/site/features/components";
import { PageHero, PageLayout } from "@/shared/components/layout";

const FEATURES_CONFIG = [
  {
    icon: Trophy,
    statusKey: "live",
    color: "from-yellow-500 to-orange-500",
    featureKey: "leaderboards",
  },
  {
    icon: Calendar,
    statusKey: "live",
    color: "from-indigo-500 to-blue-500",
    featureKey: "matchSchedule",
  },
  {
    icon: Clock,
    statusKey: "live",
    color: "from-violet-500 to-purple-500",
    featureKey: "matchSummary",
  },
  {
    icon: Target,
    statusKey: "live",
    color: "from-blue-500 to-cyan-500",
    featureKey: "shotCharts",
  },
  {
    icon: Users,
    statusKey: "live",
    color: "from-purple-500 to-indigo-500",
    featureKey: "teamRosters",
  },
  {
    icon: BarChart3,
    statusKey: "live",
    color: "from-green-500 to-emerald-500",
    featureKey: "playerComparison",
  },
  {
    icon: MapPin,
    statusKey: "live",
    color: "from-red-500 to-pink-500",
    featureKey: "clubsMap",
  },
  {
    icon: TrendingUp,
    statusKey: "coming-soon",
    color: "from-cyan-500 to-teal-500",
    featureKey: "liveStats",
  },
  {
    icon: Zap,
    statusKey: "coming-soon",
    color: "from-orange-500 to-red-500",
    featureKey: "liveUpdates",
  },
  {
    icon: Shield,
    statusKey: "planned",
    color: "from-gray-500 to-gray-700",
    featureKey: "userAccounts",
  },
] as const;

const HIGHLIGHTS_CONFIG = [
  { icon: Globe2, highlightKey: "i18n" },
  { icon: Search, highlightKey: "search" },
  { icon: Sparkles, highlightKey: "responsive" },
] as const;

export default async function FeaturesPage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  const features = FEATURES_CONFIG.map((f) => ({
    icon: f.icon,
    status: f.statusKey,
    color: f.color,
    title: t(`features.${f.featureKey}.title`),
    description: t(`features.${f.featureKey}.description`),
    statusLabel: t(`features.status.${f.statusKey}`),
  }));

  const highlights: HighlightItem[] = HIGHLIGHTS_CONFIG.map((h) => ({
    icon: h.icon,
    title: t(`features.highlights.${h.highlightKey}.title`),
    description: t(`features.highlights.${h.highlightKey}.description`),
  }));

  return (
    <PageLayout>
      <PageHero
        title={t("features.title")}
        lead={t("features.subtitle")}
        icon={Sparkles}
      />

      {/* Features Grid — cards sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Highlights Section */}
      <FeaturesHighlightsSection
        title={t("features.highlightsTitle")}
        highlights={highlights}
      />
    </PageLayout>
  );
}
