// src/frontend/features/site/docs/components/DocsChapters.tsx
"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import { DisclosureGroup } from "react-aria-components";

import { DOCS_SECTIONS } from "../constants/docsSections";
import { DocsSectionAccordion } from "./DocsSectionAccordion";
import { BestPractices } from "./sections/BestPractices";
import { DataModel } from "./sections/DataModel";
import { GettingStarted } from "./sections/GettingStarted";
import { ProjectStructure } from "./sections/ProjectStructure";

/**
 * Each chapter's body, by chapter id. Typed on the ids `DOCS_SECTIONS`
 * declares, so a renamed or added chapter without a body fails the type check
 * rather than rendering an empty panel.
 */
const CHAPTER_BODIES: Record<
  (typeof DOCS_SECTIONS)[number]["id"],
  ComponentType
> = {
  "getting-started": GettingStarted,
  database: DataModel,
  structure: ProjectStructure,
  "best-practices": BestPractices,
};

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
      {DOCS_SECTIONS.map((section) => {
        const Body = CHAPTER_BODIES[section.id];
        return (
          <DocsSectionAccordion
            key={section.id}
            id={section.id}
            icon={section.icon}
            title={t(section.titleKey)}
          >
            <Body />
          </DocsSectionAccordion>
        );
      })}
    </DisclosureGroup>
  );
}
