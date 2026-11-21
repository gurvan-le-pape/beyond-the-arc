// src/frontend/app/[locale]/(chrome)/docs/page.tsx
"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { DisclosureGroup } from "react-aria-components";

import {
  DocsBestPracticesSection,
  DocsDatabaseSection,
  DocsGettingStartedSection,
  DocsQuickLinkCard,
  DocsSectionAccordion,
  DocsStructureSection,
} from "@/features/site/docs/components";
import { DOCS_SECTIONS, QUICK_LINKS } from "@/features/site/docs/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Grid } from "@/shared/components/primitives";

/**
 * The documentation page: quick links and the collapsible chapters.
 *
 * A **client component**, so its metadata lives in the sibling `layout.tsx`: a
 * client component cannot export `generateMetadata`.
 *
 * One chapter is open at a time, and clicking the open one closes it.
 */
export default function DocsPage() {
  const t = useTranslations("landing");

  const quickLinks = QUICK_LINKS.map((link) => ({
    ...link,
    label: t(link.labelKey),
    sub: t(link.subKey),
  }));

  const sections = DOCS_SECTIONS.map((section) => ({
    ...section,
    title: t(section.titleKey),
    content: t(section.contentKey),
  }));

  return (
    <PageLayout>
      <PageHero
        title={t("docs.title")}
        lead={t("docs.intro")}
        icon={BookOpen}
      />

      {/* Quick Links */}
      <div className="mb-12">
        <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
          {quickLinks.map((link) => (
            <DocsQuickLinkCard key={link.href} {...link} />
          ))}
        </Grid>
      </div>

      <DisclosureGroup
        defaultExpandedKeys={["database"]}
        className="space-y-4 mb-12"
      >
        {sections.map((section) => (
          <DocsSectionAccordion
            key={section.id}
            id={section.id}
            icon={section.icon}
            title={section.title}
          >
            {section.id === "getting-started" && (
              <DocsGettingStartedSection content={section.content} />
            )}
            {section.id === "database" && (
              <DocsDatabaseSection content={section.content} />
            )}
            {section.id === "structure" && (
              <DocsStructureSection content={section.content} />
            )}
            {section.id === "best-practices" && (
              <DocsBestPracticesSection content={section.content} />
            )}
          </DocsSectionAccordion>
        ))}
      </DisclosureGroup>
    </PageLayout>
  );
}
