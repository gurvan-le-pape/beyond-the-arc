// src/frontend/features/site/docs/constants/docsSections.ts
import { BookOpen, Database, FolderTree, Lightbulb } from "lucide-react";

/**
 * The accordion sections, in display order.
 *
 * `id` is not decoration: the page switches on it to choose which section
 * component renders the body, and opens `"database"` by default. Renaming
 * one means changing both.
 */
export const DOCS_SECTIONS = [
  {
    id: "getting-started",
    icon: BookOpen,
    titleKey: "docs.sections.gettingStarted.title",
  },
  {
    id: "database",
    icon: Database,
    titleKey: "docs.sections.database.title",
  },
  {
    id: "structure",
    icon: FolderTree,
    titleKey: "docs.sections.structure.title",
  },
  {
    id: "best-practices",
    icon: Lightbulb,
    titleKey: "docs.sections.bestPractices.title",
  },
] as const;
