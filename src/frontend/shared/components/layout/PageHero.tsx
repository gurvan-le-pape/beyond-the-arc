// src/frontend/shared/components/layout/PageHero.tsx
import type { LucideIcon } from "lucide-react";
import React from "react";

import { Text } from "@/shared/components/typography";

interface PageHeroProps {
  /**
   * The main heading text
   */
  readonly title: string;

  /**
   * The subtitle/lead text shown below the title
   */
  readonly lead: string;

  /**
   * Icon component from lucide-react
   */
  readonly icon: LucideIcon;

  /**
   * Custom gradient colors for the icon background.
   * Defaults to the primary brand gradient (blue to purple).
   * Use semantic presets or provide custom Tailwind gradient classes.
   */
  readonly iconGradient?:
    | "primary" // blue to purple (default)
    | "secondary" // green to emerald
    | "accent" // cyan to teal
    | "warm" // orange to red
    | (string & {}); // custom gradient classes like "from-yellow-500 to-orange-500"
}

const GRADIENT_PRESETS = {
  primary: "from-blue-500 to-purple-500",
  secondary: "from-green-500 to-emerald-500",
  accent: "from-blue-500 to-cyan-500",
  warm: "from-orange-500 to-red-500",
} as const;

export function PageHero({
  title,
  lead,
  icon: Icon,
  iconGradient = "primary",
}: PageHeroProps) {
  // Resolve gradient - use preset if it matches, otherwise use custom string
  const gradientClasses =
    iconGradient in GRADIENT_PRESETS
      ? GRADIENT_PRESETS[iconGradient as keyof typeof GRADIENT_PRESETS]
      : iconGradient;

  return (
    <div className="text-center mb-12">
      {/* Icon with gradient background */}
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br ${gradientClasses} text-white mb-4 shadow-card`}
      >
        <Icon className="w-8 h-8" />
      </div>

      {/* Title */}
      <Text variant="h1" className="mb-4">
        {title}
      </Text>

      {/* Lead text with consistent max-width */}
      <Text variant="lead" className="max-w-2xl mx-auto">
        {lead}
      </Text>
    </div>
  );
}
