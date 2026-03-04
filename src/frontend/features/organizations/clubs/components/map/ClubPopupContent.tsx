// src/frontend/features/organizations/clubs/components/map/ClubPopupContent.tsx
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubPopupContentProps {
  club: ClubBasic;
}

export function ClubPopupContent({ club }: ClubPopupContentProps) {
  const router = useRouter();

  const t = useTranslations("clubs");

  return (
    <div className="min-w-[240px] max-w-[320px] p-4">
      {/* Club Name */}
      <h3 className="font-bold text-lg mb-1 text-gray-900 leading-tight">
        {club.name}
      </h3>

      {/* City and Zip */}
      {(club.city || club.zipCode) && (
        <p className="text-sm text-gray-600 mb-3 font-medium">
          {club.city}
          {club.city && club.zipCode && " • "}
          {club.zipCode}
        </p>
      )}

      {/* Contact Information */}
      {(club.email || club.phone || club.website) && (
        <div className="space-y-2 mb-4">
          {/* Email */}
          {club.email && (
            <a
              href={`mailto:${club.email}`}
              className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              title={club.email}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              <span className="text-sm text-blue-600 font-medium truncate group-hover:text-blue-700">
                {club.email}
              </span>
            </a>
          )}

          {/* Phone */}
          {club.phone && (
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              <span className="text-sm text-gray-700 font-medium">
                {club.phone}
              </span>
            </div>
          )}

          {/* Website */}
          {club.website && (
            <a
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              <span className="text-sm text-blue-600 font-medium truncate group-hover:text-blue-700">
                {t("map.visitWebsite")}
              </span>
            </a>
          )}
        </div>
      )}

      {/* See Details Button */}
      <button
        onClick={() => {
          router.push(
            `/clubs/league/${club.leagueId}/committee/${club.committeeId}/club/${club.id}`,
          );
        }}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        {t("map.seeDetails")}
      </button>
    </div>
  );
}
