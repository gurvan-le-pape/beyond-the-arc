// src/frontend/features/geography/types/MapShape.ts
/** One area of a map drawn as SVG: its official code, name and outline. */
export interface MapShape {
  /** INSEE code: "84" for a region, "01" or "2A" for a department. */
  readonly code: string;
  readonly name: string;
  /** SVG path data in the frame of the set the shape belongs to. */
  readonly d: string;
}
