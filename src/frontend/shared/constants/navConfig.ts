// src/frontend/shared/constants/navConfig.ts
import { Building2, Compass, Map as MapIcon, Trophy } from "lucide-react";

import type { NavItem } from "../types/NavItem";

/**
 * The site's sections, in header order. "Explore" is the filtered browser for
 * players, teams and matches; it keeps the `/search` path its links and the
 * home page's search form already use.
 */
export const navItems = [
  {
    href: "/championships",
    labelKey: "nav.championships",
    hintKey: "navHints.championships",
    icon: Trophy,
  },
  {
    href: "/organizations",
    labelKey: "nav.organizations",
    hintKey: "navHints.organizations",
    icon: Building2,
  },
  {
    href: "/search",
    labelKey: "nav.explore",
    hintKey: "navHints.explore",
    icon: Compass,
  },
  { href: "/map", labelKey: "nav.map", hintKey: "navHints.map", icon: MapIcon },
] as const satisfies readonly NavItem[];
