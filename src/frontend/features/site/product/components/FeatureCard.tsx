// src/frontend/features/site/product/components/FeatureCard.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

type FeatureStatus = "live" | "coming-soon" | "planned";

const STATUS_COLORS: Record<FeatureStatus, string> = {
  live: "bg-tint-success text-ink-success border border-line-success",
  "coming-soon": "bg-tint-info text-ink-info border border-line-info",
  // planned uses bg-surface-inset so it resolves correctly regardless of
  // which surface the card sits on — no hardcoded elevation level needed
  planned: "bg-surface-inset text-text-emphasis border border-divide",
};

interface FeatureCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly status: FeatureStatus;
  readonly statusLabel: string;
}

/**
 * One product feature: icon, name, description, and a status chip.
 *
 * `status` selects from a **closed set of three** chip styles. The `planned`
 * style deliberately uses `bg-surface-inset` rather than a fixed grey, so the
 * chip resolves against whatever surface the card sits on instead of assuming
 * an elevation.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  status,
  statusLabel,
}: FeatureCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <IconTile icon={Icon} />
        <span
          className={`px-2 py-1 rounded-button text-xs font-medium ${STATUS_COLORS[status]}`}
        >
          {statusLabel}
        </span>
      </div>
      <Text variant="h3" className="mb-2">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </Card>
  );
}
