// src/frontend/features/site/docs/constants/quickLinks.ts
import { BookOpen, Download, ExternalLink, Github } from "lucide-react";

import {
  API_DOCS_URL,
  CONTACT_MAILTO,
  GITHUB_REPO_URL,
} from "@/shared/constants";

/**
 * The four shortcuts at the top of the docs page, in display order. Labels are
 * resolved by the page from `landing.docs.quickLinks.*`.
 */
export const QUICK_LINKS = [
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
