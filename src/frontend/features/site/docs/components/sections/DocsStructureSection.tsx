// src/frontend/features/site/docs/components/sections/DocsStructureSection.tsx
"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

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

interface DocsStructureSectionProps {
  readonly content: string;
}

/**
 * The project-structure chapter: the prose plus the directory trees.
 *
 * `content` supplies only the prose. The trees are literals here — paths are
 * not translatable, and a drifted tree is a documentation bug rather than a
 * missing key, so nothing in `check:messages` would catch it.
 */
export function DocsStructureSection({ content }: DocsStructureSectionProps) {
  const t = useTranslations("landing");

  return (
    <div className="space-y-6">
      <Text variant="body">{content}</Text>

      <div>
        <Text variant="h3" as="h2" className="mb-3">
          {t("docs.structure.backend")}
        </Text>
        {/* Code block — intentional dark bg for readability */}
        <pre className="bg-gray-800 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
          {t("docs.structure.backendCode")}
        </pre>
        <ul className="list-disc pl-6 text-sm text-text-secondary mt-2 space-y-1">
          {BACKEND_EXPLANATION_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <div>
        <Text variant="h3" as="h2" className="mb-3">
          {t("docs.structure.frontend")}
        </Text>
        {/* Code block — intentional dark bg for readability */}
        <pre className="bg-gray-800 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
          {t("docs.structure.frontendCode")}
        </pre>
        <ul className="list-disc pl-6 text-sm text-text-secondary mt-2 space-y-1">
          {FRONTEND_EXPLANATION_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
