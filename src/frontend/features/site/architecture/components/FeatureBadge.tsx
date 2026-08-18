// src/frontend/features/site/architecture/components/FeatureBadge.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface FeatureBadgeProps {
  readonly icon: LucideIcon;
  readonly iconClassName: string;
  readonly title: string;
  readonly description: string;
}

/**
 * An icon, heading and caption in a centred column, for the feature grid.
 *
 * `iconClassName` is a **raw class string** interpolated into the icon's
 * wrapper, so it must be complete literal Tailwind classes — a value built at
 * runtime generates nothing. It carries the badge's colour, which is why it is
 * required rather than defaulted.
 */
export function FeatureBadge({
  icon: Icon,
  iconClassName,
  title,
  description,
}: FeatureBadgeProps) {
  return (
    <div className="text-center">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-button mb-3 ${iconClassName}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <Text variant="h3" className="mb-2 text-base">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
