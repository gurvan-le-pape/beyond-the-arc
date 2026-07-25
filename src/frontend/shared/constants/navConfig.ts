// src/frontend/shared/constants/navConfig.ts
import type { NavItem } from "../types/NavItem";

export const navItems = [
  { href: "/championships", labelKey: "nav.championships" },
  { href: "/organizations", labelKey: "nav.organizations" },
  { href: "/search", labelKey: "nav.search" },
  { href: "/map", labelKey: "nav.map" },
] as const satisfies readonly NavItem[];
