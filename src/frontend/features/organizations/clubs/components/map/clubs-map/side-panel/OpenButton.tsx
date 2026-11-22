// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/OpenButton.tsx
"use client";

import { List } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/primitives";

interface OpenButtonProps {
  readonly onOpen: () => void;
}

/** The floating button that opens the side panel, shown while it is closed. */
export function OpenButton({ onOpen }: OpenButtonProps) {
  const t = useTranslations("clubs");

  // A labelled list icon, not a bare hamburger: on a phone the site menu's own
  // hamburger sits right above this button, and two identical icons read as
  // one control.
  return (
    <Button
      variant="control"
      onPress={onOpen}
      className="fixed top-20 right-4 z-drawer gap-2 shadow-lg"
    >
      <List className="w-5 h-5" aria-hidden="true" />
      {t("map.openPanel")}
    </Button>
  );
}
