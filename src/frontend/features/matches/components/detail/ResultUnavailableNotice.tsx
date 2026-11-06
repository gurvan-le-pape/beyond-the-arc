// src/frontend/features/matches/components/detail/ResultUnavailableNotice.tsx
import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";

/**
 * Stands in for the stats and events of a match whose result could not be
 * produced. No list links to this page, so a reader arrives by a direct link.
 */
export function ResultUnavailableNotice() {
  const tMatches = useTranslations("matches");

  return (
    <Section title={tMatches("resultUnavailableNotice.title")}>
      <div className="flex items-start gap-3">
        <CircleAlert
          className="w-5 h-5 mt-0.5 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
        <Text variant="body">{tMatches("resultUnavailableNotice.body")}</Text>
      </div>
    </Section>
  );
}
