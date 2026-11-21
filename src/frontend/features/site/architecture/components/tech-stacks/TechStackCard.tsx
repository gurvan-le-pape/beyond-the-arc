// src/frontend/features/site/architecture/components/tech-stacks/TechStackCard.tsx
import type { LucideIcon } from "lucide-react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import { STACK_TONE_CLASSES, type StackTone } from "../../constants";
import { TechStackItem } from "./TechStackItem";

export interface TechStackItemConfig {
  name: string;
  icon: LucideIcon;
  description: string;
}

interface TechStackCardProps {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly tone: StackTone;
  readonly items: TechStackItemConfig[];
}

/**
 * A titled group of technologies — one layer of the stack.
 *
 * `items` decides the contents entirely; this adds the heading and the frame.
 */
export function TechStackCard({
  title,
  icon: Icon,
  tone,
  items,
}: TechStackCardProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className={`${STACK_TONE_CLASSES[tone]} p-6`}>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <Text variant="h2" className="text-inherit">
            {title}
          </Text>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <TechStackItem
            key={item.name}
            icon={item.icon}
            name={item.name}
            description={item.description}
          />
        ))}
      </div>
    </Card>
  );
}
