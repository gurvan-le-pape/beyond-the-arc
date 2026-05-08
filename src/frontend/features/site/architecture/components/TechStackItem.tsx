// src/frontend/features/site/architecture/components/TechStackItem.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface TechStackItemProps {
  readonly icon: LucideIcon;
  readonly name: string;
  readonly description: string;
}

export function TechStackItem({
  icon: Icon,
  name,
  description,
}: TechStackItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-button bg-surface-inset border border-transparent hover:border-divide transition-colors duration-200">
      <Icon className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
      <div>
        <Text variant="h3" className="text-base">
          {name}
        </Text>
        <Text variant="caption">{description}</Text>
      </div>
    </div>
  );
}
