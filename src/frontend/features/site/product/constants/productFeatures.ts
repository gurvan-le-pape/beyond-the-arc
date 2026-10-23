// src/frontend/features/site/product/constants/productFeatures.ts
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

/**
 * The capabilities the product page lists, in display order. Copy is resolved
 * by the page from `landing.product.<featureKey>`.
 */
export const PRODUCT_FEATURES = [
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
