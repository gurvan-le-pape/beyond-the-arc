// src/frontend/features/site/product/components/product-features/index.tsx
import {
  BarChart3,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Search,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";

import { FeatureCard } from "./FeatureCard";

/**
 * The capabilities the product page lists, in display order. Copy is resolved
 * from `landing.product.<featureKey>`.
 */
const PRODUCT_FEATURES = [
  {
    icon: Trophy,
    featureKey: "leaderboards",
  },
  {
    icon: Calendar,
    featureKey: "matchSchedule",
  },
  {
    icon: Clock,
    featureKey: "matchSummary",
  },
  {
    icon: Target,
    featureKey: "shotCharts",
  },
  {
    icon: Users,
    featureKey: "teamRosters",
  },
  {
    icon: BarChart3,
    featureKey: "playerComparison",
  },
  {
    icon: Building2,
    featureKey: "organizations",
  },
  {
    icon: MapPin,
    featureKey: "clubsMap",
  },
  {
    icon: Search,
    featureKey: "search",
  },
] as const;

/**
 * What the site lets you look up, one card per capability, in
 * `PRODUCT_FEATURES` order. Each card's copy comes from
 * `landing.product.<featureKey>`.
 */
export function ProductFeatures() {
  const t = useTranslations("landing.product");

  return (
    <div className="mb-12">
      <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {PRODUCT_FEATURES.map((feature) => (
          <FeatureCard
            key={feature.featureKey}
            icon={feature.icon}
            title={t(`${feature.featureKey}.title`)}
            description={t(`${feature.featureKey}.description`)}
          />
        ))}
      </Grid>
    </div>
  );
}
