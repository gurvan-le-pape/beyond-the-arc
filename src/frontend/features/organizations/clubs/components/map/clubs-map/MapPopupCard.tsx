// src/frontend/features/organizations/clubs/components/map/clubs-map/MapPopupCard.tsx
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { IconButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface MapPopupCardProps {
  readonly title: string;
  /** Short secondary lines under the title, already joined by the caller. */
  readonly details: ReactNode;
  readonly onClose: () => void;
  /** Everything below the header rule. */
  readonly children: ReactNode;
}

/**
 * The card every clubs-map popup is drawn in: title, quiet detail lines, a
 * close button, then the caller's body under a rule.
 *
 * The surface matches the popup tip's colour in `styles/map.css`; change one
 * and the tip stops meeting the card.
 */
export function MapPopupCard({
  title,
  details,
  onClose,
  children,
}: MapPopupCardProps) {
  const tCommon = useTranslations("common");

  return (
    <div className="w-[300px] max-w-full surface-subtle border border-divide rounded-xl shadow-lg">
      <div className="flex items-start justify-between gap-2 pt-3.5 pr-2 pb-3 pl-4">
        <div className="min-w-0">
          <Text variant="title" as="p" className="leading-snug">
            {title}
          </Text>
          {details && (
            <Text variant="caption" as="p" className="mt-1 leading-snug">
              {details}
            </Text>
          )}
        </div>
        <IconButton size="sm" label={tCommon("close")} onClick={onClose}>
          <X aria-hidden="true" />
        </IconButton>
      </div>
      <div className="border-t border-divide">{children}</div>
    </div>
  );
}
