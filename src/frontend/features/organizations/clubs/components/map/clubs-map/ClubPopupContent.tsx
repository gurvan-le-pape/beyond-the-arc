// src/frontend/features/organizations/clubs/components/map/clubs-map/ClubPopupContent.tsx
import { ArrowRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { TextLink } from "@/shared/components/primitives";
import { toSafeExternalUrl } from "@/shared/utils";

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
 * the website when there is one and the link to the club's page.
 *
 * The page link is a text link rather than a button: the popup is a label on a
 * map point, and a full-width button outweighed the club's name.
 *
 * The website link goes through the safe-URL check, because that value is
 * scraped rather than authored.
 */
export function ClubPopupContent({
  club,
  departmentName,
  onClose,
}: ClubPopupContentProps) {
  const t = useTranslations("clubs");

  // Scraped, therefore untrusted input reaching an href. Anything that is not
  // an absolute http(s) URL is treated as no website at all.
  const safeWebsite = toSafeExternalUrl(club.website);
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
      <div className="flex items-center justify-between gap-4 h-11 px-4 text-sm">
        {safeWebsite ? (
          <TextLink href={safeWebsite} variant="plain" external>
            {t("map.website")}
            <ExternalLink
              aria-hidden="true"
              className="ml-1 inline h-3.5 w-3.5"
            />
          </TextLink>
        ) : (
          <span />
        )}
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
