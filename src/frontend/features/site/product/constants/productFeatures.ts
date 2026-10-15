// src/frontend/features/site/product/constants/productFeatures.ts
import {
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

/**
 * The capabilities the product page lists, in display order.
 *
 * `statusKey` reaches its label through a template literal
 * (`product.status.${statusKey}`), so these values are live message keys even
 * though nothing references them literally — a catalogue sweep that matches
 * literals alone will report them dead. See the orphan census in #495.
 */
export const PRODUCT_FEATURES = [
  {
    icon: Trophy,
    statusKey: "live",
    featureKey: "leaderboards",
  },
  {
    icon: Calendar,
    statusKey: "live",
    featureKey: "matchSchedule",
  },
  {
    icon: Clock,
    statusKey: "live",
    featureKey: "matchSummary",
  },
  {
    icon: Target,
    statusKey: "live",
    featureKey: "shotCharts",
  },
  {
    icon: Users,
    statusKey: "live",
    featureKey: "teamRosters",
  },
  {
    icon: BarChart3,
    statusKey: "live",
    featureKey: "playerComparison",
  },
  {
    icon: MapPin,
    statusKey: "live",
    featureKey: "clubsMap",
  },
  {
    icon: TrendingUp,
    statusKey: "coming-soon",
    featureKey: "liveStats",
  },
  {
    icon: Zap,
    statusKey: "coming-soon",
    featureKey: "liveUpdates",
  },
  {
    icon: Shield,
    statusKey: "planned",
    featureKey: "userAccounts",
  },
] as const;
