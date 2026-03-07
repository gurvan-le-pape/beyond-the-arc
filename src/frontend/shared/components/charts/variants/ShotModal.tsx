// src/frontend/shared/components/charts/variants/ShotModal.tsx
"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { toPng } from "html-to-image";
import React, { useEffect, useRef } from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { ShotChart } from "@/shared/components/charts";
import { Button } from "@/shared/components/ui";
import { ChartType } from "@/shared/constants/chart-types";
import type { NamedEntity } from "@/shared/types/SelectOption";

interface ShotModalProps {
  open: boolean;
  player: NamedEntity | null;
  onClose: () => void;
  teamName: string;
  opponentTeamName: string;
  teamScore: number;
  opponentScore: number;
  getPlayerShots: (playerId: number) => MatchEvent[];
}

export const ShotModal: React.FC<ShotModalProps> = ({
  open,
  player,
  onClose,
  teamName,
  opponentTeamName,
  teamScore,
  opponentScore,
  getPlayerShots,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };
    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, [onClose]);

  const handleDownload = () => {
    if (!chartRef.current || !player) return;
    const el = chartRef.current;
    (async () => {
      const dataUrl = await toPng(el, { cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `shotchart-${player.name.replaceAll(" ", "_")}.png`;
      a.click();
    })().catch(console.error);
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 m-0 max-w-none w-full h-full p-0 border-0 backdrop:bg-transparent"
    >
      {player && (
        <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-6">
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1976d2] to-[#43a047] text-white rounded-t-2xl px-6 pt-5 pb-4 flex items-center justify-center relative min-h-[64px]">
              {/* Team 1 */}
              <div className="flex-1 flex items-center justify-end font-bold text-lg pr-4 text-right whitespace-normal break-words">
                <span className="bg-white/10 rounded px-3 py-1 inline-block">
                  {teamName}
                </span>
              </div>
              {/* Scoreboard */}
              <div className="flex flex-col items-center justify-center mx-3 min-w-[90px]">
                <div className="font-extrabold text-3xl tracking-wide bg-white/20 rounded-xl px-6 py-0.5 text-white shadow mb-0.5">
                  {teamScore}{" "}
                  <span className="font-normal text-white/70">-</span>{" "}
                  {opponentScore}
                </div>
                <div className="text-xs text-white/70 font-normal">Score</div>
              </div>
              {/* Team 2 */}
              <div className="flex-1 flex items-center justify-start font-bold text-lg pl-4 text-left whitespace-normal break-words">
                <span className="bg-white/10 rounded px-3 py-1 inline-block">
                  {opponentTeamName}
                </span>
              </div>
              {/* Close button - larger, more visible */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:text-red-300 bg-black/20 hover:bg-black/40 rounded-full"
                onClick={onClose}
                aria-label="Fermer"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Chart content — ref used for png capture */}
            <div
              ref={chartRef}
              className="px-6 pt-6 pb-6 bg-gray-50 dark:bg-gray-800 rounded-b-2xl"
            >
              <h3 className="text-lg font-bold mb-4 text-center text-blue-700 dark:text-blue-400 tracking-wide">
                Shot Chart — {player.name}
              </h3>

              <ShotChart
                matchEvents={getPlayerShots(player.id)}
                chartType={ChartType.SCATTER}
              />
            </div>

            {/* Download button outside chartRef so it's not in the screenshot */}
            <div className="flex justify-center py-4 bg-gray-50 dark:bg-gray-800 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="download"
                size="lg"
                className="rounded-full gap-2"
                onClick={handleDownload}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Télécharger le graphique
              </Button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ShotModal;
