// src/frontend/features/site/docs/constants/docsSections.ts
import { BookOpen, Database, FolderTree, Lightbulb } from "lucide-react";

/**
 * The accordion sections, in display order.
 *
 * `id` is not decoration: the page switches on it to choose which section
 * component renders the body, and `useAccordion` opens `"database"` by
 * default. Renaming one means changing both.
 */
export const DOCS_SECTIONS = [
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
