// src/frontend/features/site/docs/components/docs-chapters/GettingStarted.tsx
import { useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";
import { GITLAB_CLONE_URL } from "@/shared/constants";

import { CodeBlock } from "./CodeBlock";

const GETTING_STARTED_COMMANDS = `# Clone the repository
git clone ${GITLAB_CLONE_URL}

# Install dependencies
cd beyond-the-arc
npm install

# Setup database
docker-compose up -d
npm run prisma:migrate

# Start development server
npm run dev`;

/**
 * The getting-started chapter: the intro prose plus the setup commands.
 *
 * The prose comes from the catalogue. The commands are literals in this file —
 * they are not user-facing copy and must not be translated, so they sit outside
 * the message catalogue deliberately.
 */
export function GettingStarted() {
  const t = useTranslations("landing");

  return (
    <div className="space-y-4">
      <Text variant="body">{t("docs.sections.gettingStarted.content")}</Text>
      <CodeBlock>{GETTING_STARTED_COMMANDS}</CodeBlock>
    </div>
  );
}
