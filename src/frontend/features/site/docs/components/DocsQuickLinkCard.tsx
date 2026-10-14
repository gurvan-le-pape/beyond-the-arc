// src/frontend/features/site/docs/components/DocsQuickLinkCard.tsx
import type { LucideIcon } from "lucide-react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface DocsQuickLinkCardProps {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly sub: string;
  readonly external?: boolean;
  readonly download?: boolean;
  readonly trailIcon?: LucideIcon;
}

/**
 * A shortcut tile in the docs index.
 *
 * `external` and `download` change the anchor's behaviour rather than its look:
 * external adds a new tab with `noopener`, download asks the browser to save
 * rather than navigate. Setting both is contradictory — download wins, because
 * a saved file never opens a tab.
 *
 * `trailIcon` overrides the default chevron, which is how an external link
 * signals where it goes before it is clicked.
 */
export function DocsQuickLinkCard({
  href,
  icon: Icon,
  label,
  sub,
  external,
  download,
  trailIcon: TrailIcon,
}: DocsQuickLinkCardProps) {
  return (
    <Card
      href={href}
      external={external}
      download={download}
      padding="sm"
      className="flex items-center gap-3"
    >
      <Icon className="w-6 h-6 text-text-body" aria-hidden />
      <div className="flex flex-col">
        <Text variant="label">{label}</Text>
        <Text variant="caption">{sub}</Text>
      </div>
      {TrailIcon && (
        <TrailIcon className="w-4 h-4 ml-auto text-text-muted" aria-hidden />
      )}
    </Card>
  );
}
