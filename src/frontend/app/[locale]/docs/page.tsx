// src/frontend/app/[locale]/docs/page.tsx
"use client";

import {
  BookOpen,
  Database,
  Download,
  ExternalLink,
  FolderTree,
  Github,
  Lightbulb,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DocsBestPracticesSection,
  DocsDatabaseSection,
  DocsGettingStartedSection,
  DocsQuickLinkCard,
  DocsSectionAccordion,
  DocsStructureSection,
} from "@/features/site/docs/components";
import { useAccordion } from "@/features/site/docs/hooks";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { CONTACT_MAILTO, GITHUB_REPO_URL } from "@/shared/constants";

const QUICK_LINKS_CONFIG = [
  {
    href: GITHUB_REPO_URL,
    icon: Github,
    labelKey: "docs.quickLinks.github",
    subKey: "docs.quickLinks.viewSource",
    external: true,
    trailIcon: ExternalLink,
  },
  {
    href: "/docs/data-model.pdf",
    icon: Download,
    labelKey: "docs.quickLinks.dataModel",
    sub: "PDF",
    download: true,
  },
  {
    href: `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/docs`,
    icon: BookOpen,
    labelKey: "docs.quickLinks.apiDocs",
    sub: "Swagger",
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

const SECTIONS_CONFIG = [
  {
    id: "getting-started",
    icon: BookOpen,
    titleKey: "docs.sections.gettingStarted.title",
    contentKey: "docs.sections.gettingStarted.content",
  },
  {
    id: "database",
    icon: Database,
    titleKey: "docs.sections.database.title",
    contentKey: "docs.sections.database.content",
  },
  {
    id: "structure",
    icon: FolderTree,
    titleKey: "docs.sections.structure.title",
    contentKey: "docs.sections.structure.content",
  },
  {
    id: "best-practices",
    icon: Lightbulb,
    titleKey: "docs.sections.bestPractices.title",
    contentKey: "docs.sections.bestPractices.content",
  },
] as const;

export default function DocsPage() {
  const t = useTranslations("landing");
  const { toggle, isActive } = useAccordion("database");

  const quickLinks = QUICK_LINKS_CONFIG.map((link) => ({
    ...link,
    label: t(link.labelKey),
    sub: "subKey" in link ? t(link.subKey) : link.sub,
  }));

  const sections = SECTIONS_CONFIG.map((section) => ({
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
