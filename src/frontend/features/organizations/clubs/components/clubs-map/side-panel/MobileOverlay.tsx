// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/MobileOverlay.tsx
"use client";

import { useTranslations } from "next-intl";

interface MobileOverlayProps {
  readonly onClose: () => void;
}

/** Dimmed backdrop shown behind the open panel on small screens. */
export function MobileOverlay({ onClose }: MobileOverlayProps) {
  const t = useTranslations("clubs");

  return (
    <button
      type="button"
      className="fixed inset-0 top-16 bg-black/50 z-10 lg:hidden w-full cursor-default"
      onClick={onClose}
      aria-label={t("map.closeMenu")}
    />
  );
}

export default MobileOverlay;
