// src/frontend/features/site/docs/components/DocsSectionAccordion.tsx
import * as Accordion from "@radix-ui/react-accordion";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

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
 * One collapsible documentation section: an item of a Radix `Accordion.Root`,
 * which decides how many may be open at once. Radix wires the button to its
 * panel and gives the panel its region role.
 *
 * The title is an `h2`, so the headings inside a section's body start at
 * `h3`.
 *
 * The panel is unmounted while closed.
 */
export function DocsSectionAccordion({
  id,
  icon,
  title,
  children,
}: DocsSectionAccordionProps) {
  return (
    <Accordion.Item value={id} asChild>
      <Card padding="none" className="overflow-hidden">
        <Accordion.Header asChild>
          <h2>
            {/* Accordion button — hover steps up to surface-raised via inset */}
            <Accordion.Trigger className="group w-full flex items-center gap-4 p-6 text-left hover:bg-surface-inset transition-colors duration-200 focus-ring-inset">
              <IconTile icon={icon} size="sm" />
              <Text
                variant="label"
                as="span"
                className="flex-grow text-lg md:text-xl"
              >
                {title}
              </Text>
              <ChevronRight
                className="w-5 h-5 text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-90"
                aria-hidden
              />
            </Accordion.Trigger>
          </h2>
        </Accordion.Header>

        <Accordion.Content className="px-6 pb-6 border-t border-divide pt-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </Accordion.Content>
      </Card>
    </Accordion.Item>
  );
}
