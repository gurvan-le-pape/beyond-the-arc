// src/frontend/features/charts/components/variants/ShotModal.tsx
"use client";

import { Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { MatchEvent } from "@/features/matches/types";
import { Button } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { useModalDialog } from "@/shared/hooks";
import type { NamedEntity } from "@/shared/types";
import { logger } from "@/shared/utils";

import { ChartType } from "../../constants";
import { downloadPng, shotChartFileName } from "../../utils";
import ShotChart from "../ShotChart";

interface ShotModalProps {
  readonly open: boolean;
  readonly player: NamedEntity | null;
  readonly onClose: () => void;
  readonly teamName: string;
  readonly opponentTeamName: string;
  readonly teamScore: number | null;
  readonly opponentScore: number | null;
  readonly getPlayerShots: (playerId: number) => MatchEvent[];
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 m-0 max-w-none w-full h-full p-4 sm:p-6 border-0 backdrop:bg-transparent open:flex justify-center"
    >
      {/* The card is the dialog's direct child, so a click on the padding
          around it targets the dialog itself and dismisses it. `my-auto`
          rather than `items-center` keeps a card taller than the screen
          scrollable from its top. */}
      {player && (
        <div className="relative w-full max-w-2xl h-fit sm:my-auto surface-subtle rounded-2xl shadow-2xl">
          {/* Header — intentional decorative gradient, stays as raw Tailwind */}
          <div className="bg-gradient-to-r from-[#1976d2] to-[#43a047] text-white rounded-t-2xl px-6 pt-5 pb-4 flex items-center justify-center relative min-h-[64px]">
            <div className="flex-1 flex items-center justify-end font-bold text-lg pr-4 text-right whitespace-normal break-words">
              <span className="bg-white/10 rounded px-3 py-1 inline-block">
                {teamName}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center mx-3 min-w-[90px]">
              <div className="font-extrabold text-3xl tracking-wide bg-white/20 rounded-xl px-6 py-0.5 text-white shadow mb-0.5">
                {teamScore ?? "–"}{" "}
                <span className="font-normal text-white/70">-</span>{" "}
                {opponentScore ?? "–"}
              </div>
              <div className="text-xs text-white/70 font-normal">
                {t("matchHistory.score")}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-start font-bold text-lg pl-4 text-left whitespace-normal break-words">
              <span className="bg-white/10 rounded px-3 py-1 inline-block">
                {opponentTeamName}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:text-red-300 bg-black/20 hover:bg-black/40 rounded-full"
              onClick={onClose}
              aria-label={t("shotChart.close")}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chart content — ref used for png capture */}
          <div
            ref={chartRef}
            className="px-6 pt-6 pb-6 bg-surface-inset rounded-b-2xl"
          >
            <Text
              variant="h3"
              className="mb-4 text-center text-primary tracking-wide"
            >
              {t("shotChart.title", { name: player.name })}
            </Text>

            <ShotChart
              matchEvents={getPlayerShots(player.id)}
              chartType={ChartType.SCATTER}
            />
          </div>

          {/* Download button outside chartRef */}
          <div className="flex justify-center py-4 bg-surface-inset rounded-b-2xl border-t border-divide">
            <Button
              variant="download"
              size="lg"
              className="rounded-full gap-2"
              onClick={handleDownload}
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

export default ShotModal;
