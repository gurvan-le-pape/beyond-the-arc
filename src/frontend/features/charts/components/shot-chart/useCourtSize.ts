// src/frontend/features/charts/components/shot-chart/useCourtSize.ts
import { type RefObject, useEffect, useRef, useState } from "react";

export interface CourtSize {
  readonly width: number;
  readonly height: number;
}

/**
 * The pixel size of a court drawn across its container's width, at the
 * court's own aspect ratio, kept in step with the container as it resizes.
 *
 * `null` until the first measurement, so the court is never drawn at a wrong
 * size first. Resizes are batched to one per animation frame.
 *
 * @param aspect - the court's width divided by its height
 * @param minWidth - the narrowest the court is drawn, however narrow the container
 * @returns the ref to put on the container, and the court's size
 */
export function useCourtSize(
  aspect: number,
  minWidth: number,
): {
  containerRef: RefObject<HTMLDivElement | null>;
  size: CourtSize | null;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<CourtSize | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame: number;
    const observer = new ResizeObserver((entries) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const entry = entries[0];
        if (!entry) return;
        const width = Math.max(entry.contentRect.width, minWidth);
        setSize({ width, height: width / aspect });
      });
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [aspect, minWidth]);

  return { containerRef, size };
}
