// src/frontend/features/site/architecture/components/FeatureBadge.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

interface FeatureBadgeProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * An icon, heading and caption in a centred column, for the feature grid.
 */
export function FeatureBadge({ icon, title, description }: FeatureBadgeProps) {
  return (
    <div className="text-center">
      <div className="mb-3 flex justify-center">
        <IconTile icon={icon} />
      </div>
      <Text variant="title" className="mb-2">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
