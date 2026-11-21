// src/frontend/features/site/docs/components/docs-quick-links/index.tsx
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";

import { QUICK_LINKS } from "../../constants/quickLinks";
import { DocsQuickLinkCard } from "./DocsQuickLinkCard";

/**
 * The four shortcuts above the chapters: the source, the data model PDF, the
 * API reference and the contact address.
 */
export function DocsQuickLinks() {
  const t = useTranslations("landing");

  return (
    <div className="mb-12">
      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        {QUICK_LINKS.map((link) => (
          <DocsQuickLinkCard
            key={link.href}
            {...link}
            label={t(link.labelKey)}
            sub={t(link.subKey)}
          />
        ))}
      </Grid>
    </div>
  );
}
