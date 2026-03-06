// src/frontend/shared/components/charts/variants/ShotModal.tsx
import React from "react";

import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import { ShotChart } from "@/shared/components/charts";
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
  if (!open || !player) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl relative w-full max-w-2xl overflow-visible">
        <div className="bg-gradient-to-r from-[#1976d2] to-[#43a047] text-white rounded-t-2xl px-8 pt-5 pb-4 flex items-center justify-center relative min-h-[64px]">
          {/* Team 1 */}
          <div className="flex-1 flex items-center justify-end font-bold text-lg pr-4 text-right whitespace-normal break-words">
            <span className="bg-white/10 rounded px-3 py-1 inline-block">
              {teamName}
            </span>
          </div>
          {/* Scoreboard */}
          <div className="flex flex-col items-center justify-center mx-3 min-w-[90px]">
            <div className="font-extrabold text-3xl tracking-wide bg-white/20 rounded-xl px-6 py-0.5 text-white shadow mb-0.5">
              {teamScore} <span className="font-normal text-white/70">-</span>{" "}
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
          <button
            className="absolute top-0 right-0 text-white hover:text-red-300 font-bold bg-black/20 rounded-full w-8 h-8 text-xl flex items-center justify-center shadow transition-colors"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div className="px-6 pt-8 pb-6 bg-gray-50 rounded-b-2xl">
          <h3 className="text-lg font-bold mb-4 text-center text-blue-700 tracking-wide">
            Shot Chart - {player.name}
          </h3>
          <ShotChart
            shots={getPlayerShots(player.id)}
            chartType={ChartType.SCATTER}
          />
          {/* Download button below chart, centered */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                const svg = document.querySelector(
                  ".shotchart-container svg",
                ) as SVGSVGElement | null;
                if (!svg) return;
                const serializer = new XMLSerializer();
                const source = serializer.serializeToString(svg);
                const svgBlob = new Blob([source], {
                  type: "image/svg+xml;charset=utf-8",
                });
                const url = URL.createObjectURL(svgBlob);
                const img = new globalThis.Image();
                img.onload = function () {
                  const canvas = document.createElement("canvas");
                  canvas.width = svg.width.baseVal.value;
                  canvas.height = svg.height.baseVal.value;
                  const ctx = canvas.getContext("2d");
                  ctx && ctx.drawImage(img, 0, 0);
                  URL.revokeObjectURL(url);
                  const pngUrl = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = pngUrl;
                  a.download = `shotchart-${player.name.replaceAll(
                    " ",
                    "_",
                  )}.png`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                };
                img.src = url;
              }}
              className="bg-gradient-to-r from-blue-700 to-green-600 text-white font-semibold text-base rounded-full px-7 py-2 flex items-center gap-2 shadow hover:from-blue-800 hover:to-green-700 transition-colors"
              title="Télécharger le graphique"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger le graphique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotModal;
