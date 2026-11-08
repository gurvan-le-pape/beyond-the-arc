// src/frontend/features/organizations/clubs/components/map/clubs-map/ClubPopupContent.tsx
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { TextLink } from "@/shared/components/primitives";

import type { ClubBasic } from "../../../types/ClubBasic";
import { MapPopupCard } from "./MapPopupCard";

interface ClubPopupContentProps {
  readonly club: ClubBasic;
  /** The club's department, from the committee it belongs to; null when the map has no committee for it. */
  readonly departmentName: string | null;
  readonly onClose: () => void;
}

/**
 * The contents of a club's map popup: name, where it is, and a footer row with
 * the link to the club's page.
 *
 * The page link is a text link rather than a button: the popup is a label on a
 * map point, and a full-width button outweighed the club's name.
 */
export function ClubPopupContent({
  club,
  departmentName,
  onClose,
}: ClubPopupContentProps) {
  const t = useTranslations("clubs");

  const place = [club.city, club.zipCode].filter(Boolean).join(" · ");

  return (
    <MapPopupCard
      title={club.name}
      details={
        (place || departmentName) && (
          <>
            {place}
            {place && departmentName && <br />}
            {departmentName}
          </>
        )
      }
      onClose={onClose}
    >
      <div className="flex items-center justify-end gap-4 h-11 px-4 text-sm">
        <span className="font-semibold">
          <TextLink href={`/organizations/clubs/${club.id}`}>
            {t("map.viewClub")}
            <ArrowRight aria-hidden="true" className="ml-1 inline h-4 w-4" />
          </TextLink>
        </span>
      </div>
    </MapPopupCard>
  );
}
