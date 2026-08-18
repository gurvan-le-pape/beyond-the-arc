// src/frontend/features/site/about/components/PrincipleCard.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface PrincipleCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly color: string;
}

/**
 * One engineering principle: gradient icon, heading, and an explanation.
 *
 * `color` is a **raw Tailwind gradient class pair** (`from-… to-…`), not a
 * semantic token, interpolated straight into the class string. It must be a
 * complete literal — Tailwind only generates classes it can see written out,
 * so a value assembled at runtime produces no gradient at all. Decorative by
 * design; the token system does not cover these.
 */
export function PrincipleCard({
  icon: Icon,
  title,
  description,
  color,
}: PrincipleCardProps) {
  return (
    <div className="surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 p-6">
      {/* Decorative gradient icon — intentional, stays as raw Tailwind */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${color} text-white mb-4 shadow-sm`}
      >
        <Icon className="w-6 h-6" aria-hidden />
      </div>
      <Text variant="h3" className="mb-2">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
