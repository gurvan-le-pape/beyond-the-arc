// src/frontend/features/site/architecture/components/FeatureBadge.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface FeatureBadgeProps {
  readonly icon: LucideIcon;
  readonly iconClassName: string;
  readonly title: string;
  readonly description: string;
}

export function FeatureBadge({
  icon: Icon,
  iconClassName,
  title,
  description,
}: FeatureBadgeProps) {
  return (
    <div className="text-center">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-button mb-3 ${iconClassName}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <Text variant="h3" className="mb-2 text-base">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
