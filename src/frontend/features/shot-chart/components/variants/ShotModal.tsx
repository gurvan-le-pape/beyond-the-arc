// src/frontend/features/shot-chart/components/variants/ShotModal.tsx
"use client";

import { Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Button, IconButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { useModalDialog } from "@/shared/hooks";
import type { NamedEntity, ShotEvent } from "@/shared/types";
import { logger } from "@/shared/utils";

import { ChartType } from "../../constants";
import { downloadPng, shotChartFileName } from "../../utils";
import { ShotChart } from "../shot-chart";

interface ShotModalProps {
  readonly open: boolean;
  readonly player: NamedEntity | null;
  readonly onClose: () => void;
  readonly teamName: string;
  readonly opponentTeamName: string;
  readonly teamScore: number | null;
  readonly opponentScore: number | null;
  readonly getPlayerShots: (playerId: number) => ShotEvent[];
}

/**
 * Full-screen shot-chart dialog for one player: scoreboard header, scatter
 * chart, and a PNG download of the chart.
 *
 * `getPlayerShots` is invoked during render while the modal is open, so it
 * should be a cheap lookup rather than a one-shot fetch. The download button
 * sits outside the capture ref on purpose — the PNG is the chart, not the
 * scoreboard.
 */
export function ShotModal({
  open,
  player,
  onClose,
  teamName,
  opponentTeamName,
  teamScore,
  opponentScore,
  getPlayerShots,
}: ShotModalProps) {
  const t = useTranslations("common");
  const dialogRef = useModalDialog(open, onClose);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!chartRef.current || !player) return;
    downloadPng(chartRef.current, shotChartFileName(player.name)).catch(
      (error) => logger.error(error, "shotchart download"),
    );
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-modal overflow-y-auto bg-black/40 m-0 max-w-none max-h-none w-full h-full p-4 sm:p-6 border-0 backdrop:bg-transparent open:flex justify-center"
    >
      {/* The card is the dialog's direct child, so a click on the padding
          around it targets the dialog itself and dismisses it. `my-auto`
          rather than `items-center` keeps a card taller than the screen
          scrollable from its top. */}
      {player && (
        <div className="relative w-full max-w-2xl h-fit sm:my-auto surface-subtle rounded-2xl shadow-2xl">
          {/* Header, in the brand's solid fill. A phone has no room for two names beside the score without
              breaking words, so below `sm` it is a two-line scoreboard. */}
          <div className="bg-solid-primary text-on-solid-primary [--focus-ring-color:rgb(var(--color-on-solid-primary))] rounded-t-2xl pl-4 pr-14 py-4 sm:px-14 sm:pt-5 relative min-h-[64px]">
            <div className="flex flex-col gap-1.5 sm:hidden">
              {[
                { side: "team", name: teamName, score: teamScore },
                {
                  side: "opponent",
                  name: opponentTeamName,
                  score: opponentScore,
                },
              ].map(({ side, name, score }) => (
                <div
                  key={side}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="min-w-0 break-words font-bold text-sm">
                    {name}
                  </span>
                  <span className="font-extrabold text-2xl tabular-nums">
                    {score ?? "–"}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden sm:flex items-center justify-center">
              <div className="flex-1 min-w-0 flex items-center justify-end font-bold text-lg text-right break-words">
                <span className="bg-on-solid-primary/10 rounded px-3 py-1 inline-block max-w-full">
                  {teamName}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center mx-3 shrink-0">
                <div className="font-extrabold text-3xl tracking-wide whitespace-nowrap bg-on-solid-primary/15 rounded-xl px-6 py-0.5 shadow mb-0.5">
                  {teamScore ?? "–"} <span className="font-normal">-</span>{" "}
                  {opponentScore ?? "–"}
                </div>
                <div className="text-xs font-normal">
                  {t("matchHistory.score")}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-start font-bold text-lg text-left break-words">
                <span className="bg-on-solid-primary/10 rounded px-3 py-1 inline-block max-w-full">
                  {opponentTeamName}
                </span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <IconButton
                variant="onSolid"
                size="lg"
                shape="circle"
                onPress={onClose}
                label={t("shotChart.close")}
              >
                <X />
              </IconButton>
            </div>
          </div>

          {/* Chart content — ref used for png capture */}
          <div
            ref={chartRef}
            className="px-6 pt-6 pb-6 bg-surface-inset rounded-b-2xl"
          >
            <Text
              variant="h3"
              className="mb-4 text-center text-ink-primary tracking-wide"
            >
              {t("shotChart.title", { name: player.name })}
            </Text>

            <ShotChart
              shots={getPlayerShots(player.id)}
              chartType={ChartType.SCATTER}
            />
          </div>

          {/* Download button outside chartRef */}
          <div className="flex justify-center py-4 bg-surface-inset rounded-b-2xl border-t border-divide">
            <Button
              variant="download"
              size="lg"
              className="rounded-full gap-2"
              onPress={handleDownload}
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              {t("shotChart.download")}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
