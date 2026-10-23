// src/frontend/features/site/product/components/FeatureHighlightItem.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

interface FeatureHighlightItemProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * One entry in the highlights list: icon, heading, and a line of explanation.
 *
 * Presentation only — it holds no copy and no link, so the same item shape
 * serves any highlight the caller assembles.
 */
export function FeatureHighlightItem({
  icon,
  title,
  description,
}: FeatureHighlightItemProps) {
  return (
    <div className="text-center">
      <div className="mb-3 flex justify-center">
        <IconTile icon={icon} />
      </div>
      <Text variant="h3" className="mb-2 text-base">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
