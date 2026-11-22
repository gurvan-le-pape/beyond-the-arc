// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/Backdrop.tsx
"use client";

import { useTranslations } from "next-intl";

interface BackdropProps {
  readonly onClose: () => void;
}

/** Dimmed backdrop shown behind the open panel on small screens. */
export function Backdrop({ onClose }: BackdropProps) {
  const t = useTranslations("clubs");

  return (
    <button
      type="button"
      className="fixed inset-0 top-16 bg-black/50 z-backdrop lg:hidden w-full cursor-default"
      onClick={onClose}
      aria-label={t("map.closeMenu")}
    />
  );
}
