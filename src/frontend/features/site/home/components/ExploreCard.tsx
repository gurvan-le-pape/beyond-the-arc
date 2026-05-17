// src/frontend/features/site/home/components/ExploreCard.tsx
import { ArrowRight } from "lucide-react";

import { Link } from "@/navigation";
import type { BadgeProps } from "@/shared/components/primitives";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface ExploreCardProps {
  readonly href: string;
  readonly badgeVariant: BadgeProps["variant"];
  readonly badge: string;
  readonly title: string;
  readonly desc: string;
  readonly count: string;
  readonly countLabel: string;
}

export function ExploreCard({
  href,
  badgeVariant,
  badge,
  title,
  desc,
  count,
  countLabel,
}: ExploreCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-7 hover:bg-surface-inset transition-colors duration-150"
    >
      <div className="flex items-center justify-between">
        <Badge variant={badgeVariant} size="overline">
          {badge}
        </Badge>
        <ArrowRight
          aria-hidden
          className="w-3.5 h-3.5 text-text-secondary transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </div>

      <Text variant="h3">{title}</Text>
      <Text variant="caption">{desc}</Text>

      <p className="text-[12px] font-bold text-text-secondary pt-3 border-t border-divide mt-auto">
        <span className="text-text-heading">{count}</span> {countLabel}
      </p>
    </Link>
  );
}
