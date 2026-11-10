// src/frontend/shared/types/NavItem.ts
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  /** The link's name, under `navigation.nav`. */
  labelKey: string;
  /** One line on what the section holds, under `navigation.navHints`; shown on the mobile menu's tiles. */
  hintKey: string;
  icon: LucideIcon;
}
