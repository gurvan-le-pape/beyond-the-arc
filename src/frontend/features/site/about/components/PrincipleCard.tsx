// src/frontend/features/site/about/components/PrincipleCard.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface PrincipleCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * One engineering principle: icon, heading, and an explanation.
 */
export function PrincipleCard({
  icon: Icon,
  title,
  description,
}: PrincipleCardProps) {
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
