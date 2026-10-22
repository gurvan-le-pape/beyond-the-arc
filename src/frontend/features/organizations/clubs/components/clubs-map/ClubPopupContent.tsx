// src/frontend/features/organizations/clubs/components/clubs-map/ClubPopupContent.tsx
import { ArrowRight, ExternalLink, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, TextLink } from "@/shared/components/primitives";
import { toSafeExternalUrl } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";

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
  const tCommon = useTranslations("common");

  // Scraped, therefore untrusted input reaching an href. Anything that is not
  // an absolute http(s) URL is treated as no website at all.
  const safeWebsite = toSafeExternalUrl(club.website);
  const place = [club.city, club.zipCode].filter(Boolean).join(" · ");

  return (
    <div className="w-[300px] max-w-full surface-subtle border border-divide rounded-xl shadow-lg">
      <div className="flex items-start justify-between gap-2 pt-3.5 pr-2 pb-3 pl-4">
        <div className="min-w-0">
          <p className="text-base font-semibold leading-snug text-text-heading">
            {club.name}
          </p>
          {(place || departmentName) && (
            <p className="mt-1 text-[13px] leading-snug text-text-secondary">
              {place}
              {place && departmentName && <br />}
              {departmentName}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={tCommon("close")}
          onClick={onClose}
          className="shrink-0 h-8 w-8 text-text-secondary"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 h-11 px-4 border-t border-divide text-sm">
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
    </div>
  );
}
