// src/frontend/features/site/docs/components/docs-chapters/DocsSectionAccordion.tsx
"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

import { IconTile } from "@/shared/components/blocks";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface DocsSectionAccordionProps {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly children: React.ReactNode;
}

/**
 * One collapsible documentation section: a React Aria `Disclosure` in a
 * `DisclosureGroup`, which decides how many may be open at once. React Aria
 * wires the button to its panel, and the panel is a region.
 *
 * The title is an `h2`, so the headings inside a section's body start at
 * `h3`.
 *
 * The body is unmounted while closed: React Aria only hides a closed panel,
 * and the database section's diagram is not worth keeping alive unseen.
 */
export function DocsSectionAccordion({
  id,
  icon,
  title,
  children,
}: DocsSectionAccordionProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <Disclosure id={id}>
        {({ isExpanded }) => (
          <>
            <Heading level={2}>
              {/* Hover steps up to surface-raised via inset */}
              <Button
                slot="trigger"
                className="group w-full flex cursor-pointer items-center gap-4 p-6 text-left hover:bg-surface-inset transition-colors duration-200 focus-ring-inset"
              >
                <IconTile icon={icon} size="sm" />
                <Text
                  variant="label"
                  as="span"
                  className="flex-grow text-lg md:text-xl"
                >
                  {title}
                </Text>
                <ChevronRight
                  className="w-5 h-5 text-text-muted transition-transform duration-200 group-aria-expanded:rotate-90"
                  aria-hidden
                />
              </Button>
            </Heading>

            {/* The spacing and rule sit on the body, not the panel: React
                Aria hides a closed panel with hidden="until-found", which
                keeps the panel's own padding and border on screen. */}
            <DisclosurePanel role="region">
              {isExpanded && (
                <div className="border-t border-divide px-6 pt-6 pb-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {children}
                  </div>
                </div>
              )}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </Card>
  );
}
