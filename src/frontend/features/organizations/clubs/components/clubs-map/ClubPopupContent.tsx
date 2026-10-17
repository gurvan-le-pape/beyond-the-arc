// src/frontend/features/organizations/clubs/components/clubs-map/ClubPopupContent.tsx
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { Button, buttonVariants } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, toSafeExternalUrl } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubPopupContentProps {
  readonly club: ClubBasic;
  readonly onClose: () => void;
}

/**
 * The contents of a club's map popup: name, location, the website when there
 * is one, and a link to the club's page.
 *
 * The website link goes through the safe-URL check, because that value is
 * scraped rather than authored.
 */
export function ClubPopupContent({ club, onClose }: ClubPopupContentProps) {
  const t = useTranslations("clubs");
  const tCommon = useTranslations("common");

  // Scraped, therefore untrusted input reaching an href. Anything that is not
  // an absolute http(s) URL is treated as no website at all.
  const safeWebsite = toSafeExternalUrl(club.website);

  return (
    <div className="min-w-[240px] max-w-[320px] p-4 surface-subtle rounded-xl overflow-hidden">
      <div className="flex items-start justify-between gap-2 mb-1">
        <Text variant="h3" className="leading-tight">
          {club.name}
        </Text>
        <Button
          variant="ghost"
          size="icon"
          aria-label={tCommon("close")}
          onClick={onClose}
          className="shrink-0 -mt-1 -mr-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {(club.city || club.zipCode) && (
        <Text variant="caption" className="mb-3 font-medium">
          {club.city}
          {club.city && club.zipCode && <span aria-hidden="true"> • </span>}
          {club.zipCode}
        </Text>
      )}

      {safeWebsite && (
        <a
          href={safeWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center gap-3 p-2.5 bg-surface-inset rounded-lg hover:brightness-95 transition-colors group"
        >
          <div className="w-8 h-8 flex items-center justify-center border border-divide rounded-full">
            <svg
              className="w-4 h-4 text-ink-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <Text variant="caption" className="font-medium text-ink-primary">
            {t("detail.visitWebsite")}
          </Text>
        </a>
      )}

      {/* See Details — a link wearing the button's variant classes, which is
          how the design system already dresses navigation (see the map CTA on
          the home page). A <button> here would have no href. */}
      <Link
        href={`/organizations/clubs/${club.id}`}
        className={cn(
          buttonVariants({ variant: "primary", size: "md" }),
          "w-full",
        )}
      >
        {t("map.seeDetails")}
      </Link>
    </div>
  );
}
