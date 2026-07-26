// src/frontend/features/competitions/championships/components/detail/championship-header/index.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { Badge, Card, Divide } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatCommitteeName, formatLeagueName } from "@/shared/utils";

interface ChampionshipHeaderProps {
  readonly championship: Championship;
}

export function ChampionshipHeader({ championship }: ChampionshipHeaderProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const { committeeName, leagueName, category, gender, division, seasonYear } =
    championship;

  // The card shows the championship as an organisation line plus badges, which
  // reads well but leaves the document with no heading. This says the same
  // thing in one line, for screen readers only.
  const documentTitle = [
    committeeName ? formatCommitteeName(committeeName) : null,
    leagueName ? formatLeagueName(leagueName) : null,
    category,
    tCommon(`gender.${gender}`),
    tCompetitions("divisionWithValue", { value: division }),
    seasonYear,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card variant="highlighted" padding="none">
      <Text variant="pageTitle" className="sr-only">
        {documentTitle}
      </Text>

      <div className="px-6 py-5">
        <div className="flex flex-col gap-0.5">
          {committeeName && (
            <Text variant="body">{formatCommitteeName(committeeName)}</Text>
          )}
          {leagueName && (
            <Text variant={committeeName ? "caption" : "body"}>
              {formatLeagueName(leagueName)}
            </Text>
          )}
        </div>
      </div>

      <Divide />

      <div className="px-6 py-4 flex items-center gap-2 flex-wrap">
        {category && (
          <>
            <Badge variant="category">{category}</Badge>
            <span className="text-text-muted">·</span>
          </>
        )}
        <Badge variant={gender}>{tCommon(`gender.${gender}`)}</Badge>
        <span className="text-text-muted">·</span>
        <Badge variant="division">
          {tCompetitions("divisionWithValue", { value: division })}
        </Badge>
        <span className="text-text-muted">·</span>
        <Badge variant="info">{seasonYear}</Badge>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
