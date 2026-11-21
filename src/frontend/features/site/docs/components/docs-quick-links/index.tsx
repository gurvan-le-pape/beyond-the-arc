// src/frontend/features/site/docs/components/docs-quick-links/index.tsx
import { BookOpen, Download, ExternalLink, Gitlab } from "lucide-react";
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";
import {
  API_DOCS_URL,
  CONTACT_MAILTO,
  GITLAB_REPO_URL,
} from "@/shared/constants";

import { DocsQuickLinkCard } from "./DocsQuickLinkCard";

/**
 * The four shortcuts at the top of the docs page, in display order. Labels are
 * resolved from `landing.docs.quickLinks.*`.
 */
const QUICK_LINKS = [
  {
    href: GITLAB_REPO_URL,
    icon: Gitlab,
    labelKey: "docs.quickLinks.gitlab",
    subKey: "docs.quickLinks.viewSource",
    external: true,
    trailIcon: ExternalLink,
  },
  {
    href: "/docs/data-model.pdf",
    icon: Download,
    labelKey: "docs.quickLinks.dataModel",
    subKey: "docs.quickLinks.pdf",
    download: true,
  },
  {
    href: API_DOCS_URL,
    icon: BookOpen,
    labelKey: "docs.quickLinks.apiDocs",
    subKey: "docs.quickLinks.swagger",
    external: true,
    trailIcon: ExternalLink,
  },
  {
    href: CONTACT_MAILTO,
    icon: BookOpen,
    labelKey: "docs.quickLinks.contact",
    subKey: "docs.quickLinks.getHelp",
  },
] as const;

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
