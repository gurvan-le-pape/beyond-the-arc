// src/frontend/features/site/docs/components/docs-chapters/BestPractices.tsx
"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";

const BEST_PRACTICE_KEYS = [
  "docs.bestPractices.modular",
  "docs.bestPractices.typeScript",
  "docs.bestPractices.testing",
  "docs.bestPractices.documentation",
  "docs.bestPractices.gitWorkflow",
  "docs.bestPractices.codeReview",
] as const;

/**
 * The best-practices chapter of the docs page: its intro and the six
 * practices, each with a tick.
 */
export function BestPractices() {
  const t = useTranslations("landing");

  return (
    <div className="space-y-4">
      <Text variant="body">{t("docs.sections.bestPractices.content")}</Text>
      <ul className="space-y-3">
        {BEST_PRACTICE_KEYS.map((key) => (
          <li key={key} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-button bg-tint-success flex items-center justify-center mt-0.5">
              <span className="text-ink-success text-sm" aria-hidden>
                ✓
              </span>
            </div>
            <Text variant="body" as="span">
              {t(key)}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
