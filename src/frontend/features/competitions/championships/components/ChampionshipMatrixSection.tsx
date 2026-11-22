// src/frontend/features/competitions/championships/components/ChampionshipMatrixSection.tsx
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import type { Championship } from "@/features/competitions/championships/types";
import { Section } from "@/shared/components/blocks";

import { ChampionshipMatrix } from "./ChampionshipMatrix";

interface ChampionshipMatrixSectionProps {
  readonly championships: readonly Championship[];
  readonly title: string;
  /** The organiser's place name, which names the table for a screen reader. */
  readonly organiserName: string;
  /** The organiser's level, which colours the links on hover. */
  readonly tone: ComponentProps<typeof ChampionshipMatrix>["tone"];
  /** Shown in place of the matrix when the organiser runs no championships. */
  readonly emptyMessage: string;
}

/**
 * A league's or committee's championships as a titled section: the same
 * category × gender matrix the championships browser shows once an organiser
 * is picked, so an organiser's championships look the same wherever they
 * appear.
 */
export function ChampionshipMatrixSection({
  championships,
  title,
  organiserName,
  tone,
  emptyMessage,
}: ChampionshipMatrixSectionProps) {
  const t = useTranslations("competitions");

  return (
    <Section title={title}>
      {championships.length > 0 ? (
        <ChampionshipMatrix
          championships={championships}
          caption={t("matrixCaption", { name: organiserName })}
          tone={tone}
        />
      ) : (
        <p className="text-text-secondary">{emptyMessage}</p>
      )}
    </Section>
  );
}
