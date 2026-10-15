// src/frontend/shared/components/layout/PageHero.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

import { IconTile } from "../blocks";

interface PageHeroProps {
  /**
   * The main heading text
   */
  readonly title: string;

  /**
   * The subtitle/lead text shown below the title
   */
  readonly lead: string;

  /**
   * Icon component from lucide-react
   */
  readonly icon: LucideIcon;
}

/**
 * The centred title block at the top of an informational page: icon tile,
 * heading, and a lead paragraph.
 */
export function PageHero({ title, lead, icon }: PageHeroProps) {
  return (
    <div className="text-center mb-12">
      <div className="mb-4">
        <IconTile icon={icon} size="lg" />
      </div>

      <Text variant="h1" className="mb-4">
        {title}
      </Text>

      <Text variant="lead" className="max-w-2xl mx-auto">
        {lead}
      </Text>
    </div>
  );
}
