// src/frontend/features/site/product/components/product-features/FeatureCard.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface FeatureCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

/** One product feature: its icon, name and description. */
export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card>
      <div className="mb-4">
        <IconTile icon={Icon} />
      </div>
      <Text variant="h3" as="h2" className="mb-2">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </Card>
  );
}
