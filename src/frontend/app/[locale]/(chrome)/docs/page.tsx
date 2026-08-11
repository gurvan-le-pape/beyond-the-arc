// src/frontend/app/[locale]/(chrome)/docs/page.tsx
"use client";

import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DocsBestPracticesSection,
  DocsDatabaseSection,
  DocsGettingStartedSection,
  DocsQuickLinkCard,
  DocsSectionAccordion,
  DocsStructureSection,
} from "@/features/site/docs/components";
import { DOCS_SECTIONS, QUICK_LINKS } from "@/features/site/docs/constants";
import { useAccordion } from "@/features/site/docs/hooks";
import { PageHero, PageLayout } from "@/shared/components/layout";

export default function DocsPage() {
  const t = useTranslations("landing");
  const { toggle, isActive } = useAccordion("database");

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

      {/* Quick Links — sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((link) => (
          <DocsQuickLinkCard key={link.href} {...link} />
        ))}
      </div>

      {/* Documentation Sections */}
      <div className="space-y-4 mb-12">
        {sections.map((section) => (
          <DocsSectionAccordion
            key={section.id}
            id={section.id}
            icon={section.icon}
            title={section.title}
            isActive={isActive(section.id)}
            onToggle={toggle}
          >
            {/* Getting Started Section */}
            {section.id === "getting-started" && (
              <DocsGettingStartedSection content={section.content} />
            )}
            {/* Database Section */}
            {section.id === "database" && (
              <DocsDatabaseSection content={section.content} />
            )}
            {/* Structure Section */}
            {section.id === "structure" && (
              <DocsStructureSection content={section.content} />
            )}
            {/* Best Practices Section */}
            {section.id === "best-practices" && (
              <DocsBestPracticesSection content={section.content} />
            )}
          </DocsSectionAccordion>
        ))}
      </div>
    </PageLayout>
  );
}
