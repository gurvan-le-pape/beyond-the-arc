// src/frontend/features/site/about/components/AboutStack.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

/** `t.rich` renderer linking a message's chunk to the architecture page. */
function architectureLink(chunks: ReactNode) {
  return <TextLink href="/architecture">{chunks}</TextLink>;
}

/** How the site is built, in one paragraph, and where the full stack is. */
export function AboutStack() {
  const t = useTranslations("landing.about.stack");

  return (
    <Card padding="lg" heading={t("title")}>
      <div className="space-y-4">
        <Text>{t("body")}</Text>
        <Text>{t.rich("more", { link: architectureLink })}</Text>
      </div>
    </Card>
  );
}
