// src/frontend/features/organizations/clubs/components/map/ClubPopupContent.tsx
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Button } from "@/shared/components/primitives/Button";
import { Text } from "@/shared/components/typography";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubPopupContentProps {
  readonly club: ClubBasic;
  readonly onClose: () => void;
}

export function ClubPopupContent({ club, onClose }: ClubPopupContentProps) {
  const router = useRouter();

  const t = useTranslations("clubs");

  return (
    <div className="min-w-[240px] max-w-[320px] p-4 surface-subtle rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        {/* Club Name */}
        <Text variant="h3" className="leading-tight">
          {club.name}
        </Text>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={onClose}
          className="shrink-0 -mt-1 -mr-1 h-8 w-8"
        >
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* City and Zip */}
      {(club.city || club.zipCode) && (
        <Text variant="caption" className="mb-3 font-medium">
          {club.city}
          {club.city && club.zipCode && " • "}
          {club.zipCode}
        </Text>
      )}

      {/* Contact Information */}
      {(club.email || club.phone || club.website) && (
        <div className="space-y-2 mb-4">
          {/* Email */}
          {club.email && (
            <a
              href={`mailto:${club.email}`}
              className="flex items-center gap-3 p-2.5 bg-surface-inset rounded-lg hover:brightness-95 transition-colors group"
              title={club.email}
            >
              <div className="w-8 h-8 flex items-center justify-center border border-divide rounded-full">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <Text
                variant="caption"
                className="font-medium truncate text-primary"
              >
                {club.email}
              </Text>
            </a>
          )}

          {/* Phone */}
          {club.phone && (
            <div className="flex items-center gap-3 p-2.5 bg-surface-inset rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center border border-divide rounded-full">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <Text variant="caption" className="font-medium">
                {club.phone}
              </Text>
            </div>
          )}

          {/* Website */}
          {club.website && (
            <a
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-surface-inset rounded-lg hover:brightness-95 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center border border-divide rounded-full">
                <svg
                  className="w-4 h-4 text-primary"
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
              <Text variant="caption" className="font-medium text-primary">
                {t("map.visitWebsite")}
              </Text>
            </a>
          )}
        </div>
      )}

      {/* See Details Button */}
      <Button
        variant="primary"
        size="md"
        className="w-full"
        onClick={() => router.push(`/organizations/clubs/${club.id}`)}
      >
        {t("map.seeDetails")}
      </Button>
    </div>
  );
}
