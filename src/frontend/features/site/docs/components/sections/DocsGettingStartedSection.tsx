// src/frontend/features/site/docs/components/sections/DocsGettingStartedSection.tsx
import { Text } from "@/shared/components/typography";
import { GITLAB_CLONE_URL } from "@/shared/constants";

import { CodeBlock } from "../CodeBlock";

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

interface DocsGettingStartedSectionProps {
  readonly content: string;
}

/**
 * The getting-started chapter: the intro prose plus the setup commands.
 *
 * `content` supplies only the prose. The commands are literals in this file —
 * they are not user-facing copy and must not be translated, so they sit outside
 * the message catalogue deliberately.
 */
export function DocsGettingStartedSection({
  content,
}: DocsGettingStartedSectionProps) {
  return (
    <div className="space-y-4">
      <Text variant="body">{content}</Text>
      <CodeBlock>{GETTING_STARTED_COMMANDS}</CodeBlock>
    </div>
  );
}
