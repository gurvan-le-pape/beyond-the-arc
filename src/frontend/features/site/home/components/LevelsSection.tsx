// src/frontend/features/site/home/components/LevelsSection.tsx
import { useTranslations } from "next-intl";

import type { Stats } from "@/features/stats/types";
import { Text } from "@/shared/components/typography";

import { LEVEL_ROWS } from "../constants/homeSections";
import { LevelRow } from "./LevelRow";

interface LevelsSectionProps {
  readonly championshipsByLevel: Stats["championshipsByLevel"];
}

/**
 * The three competition levels, each with its championship count and a link to
 * its tab of the championships page.
 *
 * A level with no championships yet is listed last and not linked — there is
 * nothing behind the link. The sort is stable, so covered levels keep their
 * `LEVEL_ROWS` order and an uncovered one moves back once it has data.
 */
export function LevelsSection({ championshipsByLevel }: LevelsSectionProps) {
  const t = useTranslations("home.levels");

  const levels = LEVEL_ROWS.map((row) => {
    const championshipCount = championshipsByLevel[row.level];
    return {
      level: row.level,
      name: t(`${row.level}.name`),
      detail: t(`${row.level}.detail`),
      // One message, three counts — ICU picks the plural form.
      count: t("championshipCount", { count: championshipCount }),
      href:
        championshipCount > 0 ? `/championships?tab=${row.level}` : undefined,
    };
  }).sort((a, b) => Number(!a.href) - Number(!b.href));

  return (
    <>
      <div className="px-6 pt-7 pb-2">
        <Text variant="overline" as="h2">
          {t("sectionTitle")}
        </Text>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-10">
        {levels.map((level) => (
          <LevelRow key={level.name} {...level} />
        ))}
      </div>
    </>
  );
}

export default LevelsSection;
