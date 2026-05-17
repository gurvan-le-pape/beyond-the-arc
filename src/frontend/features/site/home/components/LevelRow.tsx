// src/frontend/features/site/home/components/LevelRow.tsx
import { ArrowRight } from "lucide-react";

import { Link } from "@/navigation";
import { Text } from "@/shared/components/typography";

interface LevelRowProps {
  readonly href: string;
  readonly dot: string;
  readonly name: string;
  readonly detail: string;
  readonly count: string;
}

export function LevelRow({ href, dot, name, detail, count }: LevelRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-4 py-3 border border-divide rounded-card hover:bg-surface-inset transition-colors duration-150"
    >
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />

      <span className="text-sm font-bold flex-1 text-text-heading">{name}</span>

      <Text variant="caption" as="span" className="hidden sm:block">
        {detail}
      </Text>

      <Text variant="caption" as="span" className="hidden md:block font-bold">
        {count}
      </Text>

      <ArrowRight
        aria-hidden
        className="w-3.5 h-3.5 text-primary transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
