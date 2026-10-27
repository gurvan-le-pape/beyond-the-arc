// src/frontend/features/organizations/clubs/components/map/clubs-map/useMapColours.ts
"use client";

import { useEffect, useState } from "react";

/** A filled area of the map (region, department) and its count label. */
interface AreaColours {
  readonly fill: string;
  readonly border: string;
  readonly label: string;
}

/** The theme colours the map draws with, as values MapLibre can parse. */
export interface MapColours {
  readonly theme: "light" | "dark" | "high-contrast";
  readonly regions: AreaColours;
  readonly departments: AreaColours;
  readonly clubs: { readonly fill: string; readonly text: string };
  /** Fill behind a count label, and the ring around a club marker. */
  readonly labelBackground: string;
}

/**
 * Reads one colour token off the document as `rgb(r, g, b)`. MapLibre paints
 * with literal colours and cannot resolve a CSS variable itself.
 *
 * @param style - the document's computed style
 * @param token - the token name, without the `--color-` prefix
 * @returns the token's current value in a form MapLibre parses
 */
function readToken(style: CSSStyleDeclaration, token: string): string {
  const [r, g, b] = style
    .getPropertyValue(`--color-${token}`)
    .trim()
    .split(/\s+/);
  return `rgb(${r}, ${g}, ${b})`;
}

function readColours(): MapColours {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const area = (tone: string): AreaColours => ({
    fill: readToken(style, `solid-${tone}`),
    border: readToken(style, `solid-${tone}`),
    label: readToken(style, `ink-${tone}`),
  });
  let theme: MapColours["theme"] = "light";
  if (root.classList.contains("high-contrast")) theme = "high-contrast";
  else if (root.classList.contains("dark")) theme = "dark";
  return {
    theme,
    regions: area("secondary"),
    departments: area("primary"),
    clubs: {
      fill: readToken(style, "solid-clubs"),
      text: readToken(style, "on-solid-clubs"),
    },
    labelBackground: readToken(style, "surface-subtle"),
  };
}

/**
 * The map's colours for the current theme, read from the colour roles and
 * read again whenever the theme class on `<html>` changes. Watching the class
 * rather than next-themes' state matters: the provider applies the class in
 * its own effect, which runs after this component's, so its state would be
 * read against the previous theme's stylesheet.
 *
 * @returns the colours, or null before the first read on the client
 */
export function useMapColours(): MapColours | null {
  const [colours, setColours] = useState<MapColours | null>(null);

  useEffect(() => {
    const update = () => setColours(readColours());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colours;
}
