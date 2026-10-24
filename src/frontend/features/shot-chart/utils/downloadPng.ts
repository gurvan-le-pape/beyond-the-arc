// src/frontend/features/shot-chart/utils/downloadPng.ts
import { toPng } from "html-to-image";

/**
 * A file name for a player's shot chart that is valid on every platform: any
 * run of characters other than letters and digits becomes one underscore.
 *
 * @param playerName - the player's name, accents and all
 * @returns the PNG's file name
 */
export function shotChartFileName(playerName: string): string {
  return `shotchart-${playerName.replace(/[^\p{L}\p{N}]+/gu, "_")}.png`;
}

/**
 * Renders an element to a PNG and hands it to the browser to save.
 *
 * @param element - what to capture
 * @param fileName - the name the file is saved under
 */
export async function downloadPng(
  element: HTMLElement,
  fileName: string,
): Promise<void> {
  const dataUrl = await toPng(element, { cacheBust: true });
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}
