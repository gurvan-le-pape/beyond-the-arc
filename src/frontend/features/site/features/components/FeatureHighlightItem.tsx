// src/frontend/features/site/features/components/FeatureHighlightItem.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface FeatureHighlightItemProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

export function FeatureHighlightItem({
  icon: Icon,
  title,
  description,
}: FeatureHighlightItemProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-primary-subtle text-primary-strong mb-3">
        <Icon className="w-6 h-6" aria-hidden />
      </div>
      <Text variant="h3" className="mb-2 text-base">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
