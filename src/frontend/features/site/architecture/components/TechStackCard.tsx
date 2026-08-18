// src/frontend/features/site/architecture/components/TechStackCard.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

import { TechStackItem } from "./TechStackItem";

export interface TechStackItemConfig {
  name: string;
  icon: LucideIcon;
  description: string;
}

interface TechStackCardProps {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly items: TechStackItemConfig[];
}

/**
 * A titled group of technologies — one layer of the stack.
 *
 * `items` decides the contents entirely; this adds the heading and the frame.
 *
 * `color` is a **raw Tailwind gradient class pair** (`from-… to-…`), not a
 * semantic token, interpolated straight into the class string. It must be a
 * complete literal — Tailwind only generates classes it can see written out,
 * so a value assembled at runtime produces no gradient at all. Decorative by
 * design; the token system does not cover these.
 */
export function TechStackCard({
  title,
  icon: Icon,
  color,
  items,
}: TechStackCardProps) {
  return (
    <div className="surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${color} p-6 text-white`}>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <Text variant="h2" className="text-white text-xl">
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
    </div>
  );
}
