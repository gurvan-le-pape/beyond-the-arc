// src/frontend/shared/components/ui/primitives/ImageWithFallback.tsx
import { useEffect, useRef } from "react";

// src/frontend/shared/components/ui/primitives/ImageWithFallback.tsx
export function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
}: {
  readonly src: string;
  readonly alt: string;
  readonly fallback: string;
  readonly className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;

    // If image already failed before effect ran
    if (!img.complete || img.naturalWidth === 0) {
      img.src = fallback;
      return;
    }

    const handler = () => {
      img.onerror = null;
      img.src = fallback;
    };
    img.addEventListener("error", handler);
    return () => img.removeEventListener("error", handler);
  }, [fallback]);

  return (
    <img ref={ref} src={src} alt={alt} className={className} loading="lazy" />
  );
}
