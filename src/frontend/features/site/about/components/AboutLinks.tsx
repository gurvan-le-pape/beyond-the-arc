// src/frontend/features/site/about/components/AboutLinks.tsx
import { ExternalLink } from "lucide-react";

import { TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

export interface AboutLink {
  readonly href: string;
  readonly label: string;
  readonly description: string;
  /** Off the site, so it opens in a new tab and carries the external mark. */
  readonly external?: boolean;
}

interface AboutLinksProps {
  readonly links: readonly AboutLink[];
}

/** Where to go next from the about page: each link, and what is there. */
export function AboutLinks({ links }: AboutLinksProps) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Text variant="body" as="span" className="font-medium">
            <TextLink href={link.href} external={link.external}>
              {link.label}
              {link.external && (
                <ExternalLink
                  aria-hidden="true"
                  className="ml-1 inline h-3.5 w-3.5 align-baseline"
                />
              )}
            </TextLink>
          </Text>
          <Text variant="caption" as="span" className="block">
            {link.description}
          </Text>
        </li>
      ))}
    </ul>
  );
}
