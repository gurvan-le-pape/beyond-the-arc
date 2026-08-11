// src/frontend/features/site/product/components/FeatureCard.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

type FeatureStatus = "live" | "coming-soon" | "planned";

const STATUS_COLORS: Record<FeatureStatus, string> = {
  live: "bg-success-subtle text-success-strong border border-success/30",
  "coming-soon": "bg-info-subtle text-info-strong border border-info/30",
  // planned uses bg-surface-inset so it resolves correctly regardless of
  // which surface the card sits on — no hardcoded elevation level needed
  planned: "bg-surface-inset text-text-emphasis border border-divide",
};

interface FeatureCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly status: FeatureStatus;
  readonly color: string;
  readonly statusLabel: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  status,
  color,
  statusLabel,
}: FeatureCardProps) {
  return (
    <div className="surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        {/* Feature icon — decorative gradient, intentional */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${color} text-white shadow-sm`}
        >
          <Icon className="w-6 h-6" aria-hidden />
        </div>
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
    </div>
  );
}
