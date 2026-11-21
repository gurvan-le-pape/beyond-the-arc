// src/frontend/features/site/docs/constants/docsSections.ts
import { BookOpen, Database, FolderTree, Lightbulb } from "lucide-react";

/**
 * The documentation's chapters, in display order.
 *
 * `id` keys each chapter's body in `DocsChapters`, which is typed on these ids,
 * and `"database"` is the chapter that starts open.
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
