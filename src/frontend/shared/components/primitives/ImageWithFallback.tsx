// src/frontend/shared/components/primitives/ImageWithFallback.tsx
"use client";
import { useEffect, useRef } from "react";

interface ImageWithFallbackProps {
  readonly src: string;
  readonly alt: string;
  readonly fallback: string;
  readonly className?: string;
  /** Mirrors the `<img>` attribute. Defaults to deferring the request. */
  readonly loading?: "lazy" | "eager";
}

/**
 * An `<img>` that swaps to [fallback] when its source fails to load, and only
 * then.
 */
export function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
  loading = "lazy",
}: ImageWithFallbackProps) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    // An image that already failed before hydration never fires `error` again,
    // so that one case has to be caught here rather than by the handler below.
    // `complete` is what makes the test safe: it stays false while a request is
    // in flight *and* while a lazy image is still deferred, so a zero
    // naturalWidth only means "broken" once `complete` is true.
    if (img?.complete && img.naturalWidth === 0) img.src = fallback;
  }, [src, fallback]);

  return (
    // The point of this component is swapping the src on the DOM node, which
    // next/image does not expose.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(event) => {
        const img = event.currentTarget;
        // Stop a missing fallback asset from re-entering the handler forever.
        if (!img.src.endsWith(fallback)) img.src = fallback;
      }}
    />
  );
}
