// src/frontend/features/site/about/constants/principles.ts
import {
  Boxes,
  FileCode2,
  Globe,
  Recycle,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

/**
 * The engineering principles the about page lists, in display order.
 *
 * Copy lives in the `landing.about.*` catalogue and is resolved by the page —
 * this holds only what is not translated: the icon, the decorative gradient,
 * and the key that locates the strings.
 */
export const PRINCIPLES = [
  { icon: Boxes, principleKey: "modular" },
  {
    icon: FileCode2,
    principleKey: "separation",
  },
  {
    icon: Recycle,
    principleKey: "reusability",
  },
  {
    icon: TrendingUp,
    principleKey: "scalability",
  },
  {
    icon: Users,
    principleKey: "readability",
  },
  { icon: Globe, principleKey: "i18n" },
  {
    icon: Wrench,
    principleKey: "tooling",
  },
] as const;
