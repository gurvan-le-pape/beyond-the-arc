// src/frontend/features/site/about/components/AboutLinks.tsx
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { GITLAB_REPO_URL } from "@/shared/constants";

/**
 * The links in display order; `key` is also the `landing.about.links.*`
 * message group. An external link opens in a new tab and carries the
 * external mark.
 */
const ABOUT_LINKS = [
  { key: "product", href: "/product", external: false },
  { key: "architecture", href: "/architecture", external: false },
  { key: "docs", href: "/docs", external: false },
  { key: "source", href: GITLAB_REPO_URL, external: true },
] as const;

/** Where to go next from the about page: each link, and what is there. */
export function AboutLinks() {
  const t = useTranslations("landing.about.links");

  return (
    <Card padding="lg" heading={t("title")}>
      <ul className="space-y-3">
        {ABOUT_LINKS.map(({ key, href, external }) => (
          <li key={key}>
            <Text variant="body" as="span" className="font-medium">
              <TextLink href={href} external={external}>
                {t(`${key}.label`)}
                {external && (
                  <ExternalLink
                    aria-hidden="true"
                    className="ml-1 inline h-3.5 w-3.5 align-baseline"
                  />
                )}
              </TextLink>
            </Text>
            <Text variant="caption" as="span" className="block">
              {t(`${key}.description`)}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
