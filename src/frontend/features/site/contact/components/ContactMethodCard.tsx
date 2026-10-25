// src/frontend/features/site/contact/components/ContactMethodCard.tsx
import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface ContactMethodCardProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

/**
 * One way to make contact: icon, label, and the address or handle as a link.
 *
 * `href` carries its own scheme — `mailto:`, `tel:` or `https:` — and is not
 * validated here, because these are written in the code rather than sourced
 * from data. A URL from outside the app belongs behind `toSafeExternalUrl`.
 */
export function ContactMethodCard({
  icon: Icon,
  label,
  value,
  href,
}: ContactMethodCardProps) {
  const isExternal = href.startsWith("http");

  return (
    <Card href={href} external={isExternal} className="group">
      <div className="mb-4 w-fit transition-transform duration-200 motion-safe:group-hover:scale-110">
        <IconTile icon={Icon} />
      </div>
      <Text variant="title" as="h2" className="mb-2">
        {label}
      </Text>
      <Text variant="caption" className="break-all">
        {value}
      </Text>
    </Card>
  );
}
