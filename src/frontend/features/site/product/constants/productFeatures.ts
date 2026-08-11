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
