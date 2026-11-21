// src/frontend/shared/components/blocks/IconHighlight.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

import { IconTile } from "./IconTile";

interface IconHighlightProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

/**
 * One point in a row of highlights: an icon tile over a heading and a line of
 * explanation, centred.
 *
 * Presentation only — it holds no copy and no link, so the caller decides
 * what each point says and how many sit side by side.
 */
export function IconHighlight({
  icon,
  title,
  description,
}: IconHighlightProps) {
  return (
    <div className="text-center">
      <div className="mb-3 flex justify-center">
        <IconTile icon={icon} />
      </div>
      <Text variant="title" className="mb-2">
        {title}
      </Text>
      <Text variant="caption">{description}</Text>
    </div>
  );
}
