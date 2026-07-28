// src/frontend/features/competitions/championships/components/detail/ChampionshipHeader.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
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
  // thing in one line, for screen readers only — and is the same string the
  // page uses as its document title.
  const documentTitle = buildChampionshipTitle(championship, {
    gender: tCommon(`gender.${gender}`),
    division: tCompetitions("divisionWithValue", { value: division }),
  });

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

      {/*
        The dots between the badges are typographic punctuation, not content:
        the badges are already separated by `gap-2`, and each one names itself.
        Without `aria-hidden` a screen reader reads the row as "Seniors, middle
        dot, Men, middle dot, Division 1, middle dot, 2025-2026" — three
        announcements that say nothing and break the rhythm of the four that
        do. This is also why the dots stay on `text-text-muted`, which is the
        token for exactly this: marks that are drawn but not read.
      */}
      <div className="px-6 py-4 flex items-center gap-2 flex-wrap">
        {category && (
          <>
            <Badge variant="category">{category}</Badge>
            <span aria-hidden="true" className="text-text-muted">
              ·
            </span>
          </>
        )}
        <Badge variant={gender}>{tCommon(`gender.${gender}`)}</Badge>
        <span aria-hidden="true" className="text-text-muted">
          ·
        </span>
        <Badge variant="division">
          {tCompetitions("divisionWithValue", { value: division })}
        </Badge>
        <span aria-hidden="true" className="text-text-muted">
          ·
        </span>
        <Badge variant="info">{seasonYear}</Badge>
      </div>
    </Card>
  );
}

export default ChampionshipHeader;
