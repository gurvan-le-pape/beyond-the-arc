// src/frontend/features/site/docs/components/sections/ProjectStructure.tsx
"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

import { CodeBlock } from "../CodeBlock";

const BACKEND_EXPLANATION_KEYS = [
  "docs.structure.backendModulesExplanation",
  "docs.structure.backendCommonExplanation",
  "docs.structure.backendPrismaExplanation",
] as const;

const FRONTEND_EXPLANATION_KEYS = [
  "docs.structure.routingExplanation",
  "docs.structure.featurePrinciple",
  "docs.structure.sharedExplanation",
  "docs.structure.libExplanation",
  "docs.structure.stylesExplanation",
  "docs.structure.publicExplanation",
] as const;

/**
 * The project-structure chapter: the prose plus the directory trees.
 *
 * The prose comes from the catalogue. The trees are literals here — paths are
 * not translatable, and a drifted tree is a documentation bug rather than a
 * missing key, so nothing in `check:messages` would catch it.
 */
export function ProjectStructure() {
  const t = useTranslations("landing");

  return (
    <div className="space-y-6">
      <Text variant="body">{t("docs.sections.structure.content")}</Text>

      <div>
        <Text variant="h3" as="h3" className="mb-3">
          {t("docs.structure.backend")}
        </Text>
        <CodeBlock>{t("docs.structure.backendCode")}</CodeBlock>
        <ul className="list-disc pl-6 text-sm text-text-secondary mt-2 space-y-1">
          {BACKEND_EXPLANATION_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <div>
        <Text variant="h3" as="h3" className="mb-3">
          {t("docs.structure.frontend")}
        </Text>
        <CodeBlock>{t("docs.structure.frontendCode")}</CodeBlock>
        <ul className="list-disc pl-6 text-sm text-text-secondary mt-2 space-y-1">
          {FRONTEND_EXPLANATION_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
