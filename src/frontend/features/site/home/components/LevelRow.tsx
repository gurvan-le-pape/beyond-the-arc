// src/frontend/features/site/home/components/LevelRow.tsx
import { ArrowRight } from "lucide-react";

import { Link } from "@/navigation";
import { Text } from "@/shared/components/typography";

interface LevelRowProps {
  /** The level's listing; absent when the level has nothing to list yet. */
  readonly href?: string;
  readonly dot: string;
  readonly name: string;
  readonly detail: string;
  readonly count: string;
}

/**
 * One competition level in the home page's list, linking to its listing — or,
 * with no `href`, a muted row with no arrow for a level not covered yet.
 *
 * `dot` is the level's colour class, applied to the leading marker — a literal
 * Tailwind class, since a constructed one would generate nothing.
 *
 * `count` is a pre-formatted string: separators and plurals are the locale's
 * business, not this component's.
 */
export function LevelRow({ href, dot, name, detail, count }: LevelRowProps) {
  const content = (
    <>
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />

      <span className="text-sm font-bold flex-1 text-text-heading">{name}</span>

      <Text variant="caption" as="span" className="hidden sm:block">
        {detail}
      </Text>

      <Text variant="caption" as="span" className="hidden md:block font-bold">
        {count}
      </Text>
    </>
  );

  if (!href) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 border border-dashed border-divide rounded-card">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-4 py-3 border border-divide rounded-card hover:bg-surface-inset transition-colors duration-150"
    >
      {content}

      <ArrowRight
        aria-hidden
        className="w-3.5 h-3.5 text-ink-primary transition-transform duration-150 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
