// src/frontend/features/site/docs/components/docs-chapters/index.tsx
"use client";

import { BookOpen, Database, FolderTree, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import { DisclosureGroup } from "react-aria-components";

import { BestPractices } from "./BestPractices";
import { DataModel } from "./DataModel";
import { DocsSectionAccordion } from "./DocsSectionAccordion";
import { GettingStarted } from "./GettingStarted";
import { ProjectStructure } from "./ProjectStructure";

/**
 * The documentation's chapters, in display order, each with the component
 * that renders its body. `id` names the chapter for the `DisclosureGroup`, and
 * `"database"` is the one that starts open.
 */
const DOCS_CHAPTERS = [
  {
    id: "getting-started",
    icon: BookOpen,
    titleKey: "docs.sections.gettingStarted.title",
    Body: GettingStarted,
  },
  {
    id: "database",
    icon: Database,
    titleKey: "docs.sections.database.title",
    Body: DataModel,
  },
  {
    id: "structure",
    icon: FolderTree,
    titleKey: "docs.sections.structure.title",
    Body: ProjectStructure,
  },
  {
    id: "best-practices",
    icon: Lightbulb,
    titleKey: "docs.sections.bestPractices.title",
    Body: BestPractices,
  },
] as const;

/**
 * The documentation's chapters, one open at a time; clicking the open one
 * closes it. The database chapter starts open.
 */
export function DocsChapters() {
  const t = useTranslations("landing");

  return (
    <DisclosureGroup
      defaultExpandedKeys={["database"]}
      className="space-y-4 mb-12"
    >
      {DOCS_CHAPTERS.map(({ id, icon, titleKey, Body }) => (
        <DocsSectionAccordion key={id} id={id} icon={icon} title={t(titleKey)}>
          <Body />
        </DocsSectionAccordion>
      ))}
    </DisclosureGroup>
  );
}
