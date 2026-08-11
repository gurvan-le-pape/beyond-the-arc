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
  { icon: Boxes, principleKey: "modular", color: "from-blue-500 to-cyan-500" },
  {
    icon: FileCode2,
    principleKey: "separation",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Recycle,
    principleKey: "reusability",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    principleKey: "scalability",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    principleKey: "readability",
    color: "from-indigo-500 to-blue-500",
  },
  { icon: Globe, principleKey: "i18n", color: "from-cyan-500 to-teal-500" },
  {
    icon: Wrench,
    principleKey: "tooling",
    color: "from-yellow-500 to-orange-500",
  },
] as const;
