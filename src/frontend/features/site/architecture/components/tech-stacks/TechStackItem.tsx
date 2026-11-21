// src/frontend/features/site/architecture/components/tech-stacks/TechStackItem.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface TechStackItemProps {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly description: string;
}

/**
 * One technology in a stack card: icon, name, and a one-line description.
 *
 * A plain row with no box of its own: the card's border already frames it.
 */
export function TechStackItem({
  icon: Icon,
  name,
  description,
}: TechStackItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
      <div>
        <Text variant="title">{name}</Text>
        <Text variant="caption">{description}</Text>
      </div>
    </div>
  );
}
