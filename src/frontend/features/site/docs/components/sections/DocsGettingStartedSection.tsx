// src/frontend/features/site/docs/components/sections/DocsGettingStartedSection.tsx
import { Text } from "@/shared/components/typography";
import { GITHUB_CLONE_URL } from "@/shared/constants";

const GETTING_STARTED_COMMANDS = `# Clone the repository
git clone ${GITHUB_CLONE_URL}

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
 * the message catalogue deliberately. Their dark code block is a raw colour
 * rather than a surface token, because a code sample reads the same in both
 * themes.
 */
export function DocsGettingStartedSection({
  content,
}: DocsGettingStartedSectionProps) {
  return (
    <div className="space-y-4">
      <Text variant="body">{content}</Text>
      {/* Code block — intentional dark bg for readability */}
      <div className="bg-gray-900 text-gray-100 p-6 rounded-button">
        <pre className="text-sm overflow-x-auto">
          {GETTING_STARTED_COMMANDS}
        </pre>
      </div>
    </div>
  );
}
