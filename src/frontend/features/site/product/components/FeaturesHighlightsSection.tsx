// src/frontend/features/site/product/components/FeaturesHighlightsSection.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

import { FeatureHighlightItem } from "./FeatureHighlightItem";

export interface HighlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesHighlightsSectionProps {
  readonly title: string;
  readonly highlights: HighlightItem[];
}

/**
 * The titled block of product highlights beneath the feature grid.
 *
 * `highlights` decides the contents; this contributes the heading and the
 * layout. It is the named counterpart of the features grid above it, which is
 * still a raw `div` in the page.
 */
export function FeaturesHighlightsSection({
  title,
  highlights,
}: FeaturesHighlightsSectionProps) {
  return (
    // Highlights Section — sits on surface-base, establishes surface-subtle context
    <div className="surface-subtle rounded-card border border-divide shadow-card p-8">
      <Text variant="h2" className="mb-6 text-center text-xl">
        {title}
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <FeatureHighlightItem
            key={highlight.title}
            icon={highlight.icon}
            title={highlight.title}
            description={highlight.description}
          />
        ))}
      </div>
    </div>
  );
}
