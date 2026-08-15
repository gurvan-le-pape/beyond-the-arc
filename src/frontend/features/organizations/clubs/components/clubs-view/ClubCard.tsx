// src/frontend/features/organizations/clubs/components/clubs-view/ClubCard.tsx
import { Link } from "@/navigation";
import { Badge, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, formatNameToFileName } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubCardProps {
  readonly club: ClubBasic;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Link
      href={`/organizations/clubs/${club.id}`}
      className={cn(
        "group relative overflow-hidden rounded-card border text-left w-full",
        "surface-subtle shadow-card",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "hover:shadow-card-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-surface",
        "border-clubs/40 hover:border-clubs",
        "flex",
      )}
    >
      {/* Logo panel */}
      <div
        className={cn(
          "flex-shrink-0 w-20 flex items-center justify-center",
          "bg-gradient-to-br from-[var(--surface-inset)] to-[var(--surface-bg)]",
          "border-r border-white/5",
        )}
      >
        <ImageWithFallback
          src={`/images/clubs/${formatNameToFileName(club.name)}.webp`}
          alt={club.name}
          fallback="/images/clubs/defaultLogo.30cc7520.svg"
          className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        {(club.city || club.zipCode) && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-clubs/10">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-clubs" />
              {club.city && (
                <Text
                  variant="label"
                  className="font-medium text-clubs-strong truncate"
                >
                  {club.city}
                </Text>
              )}
            </div>
            {club.zipCode && (
              <Badge variant="info" size="sm" className="flex-shrink-0">
                {club.zipCode}
              </Badge>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-4 py-3 flex items-center flex-1">
          <Text
            variant="h3"
            className="leading-snug line-clamp-2 text-base md:text-lg group-hover:text-primary-strong transition-colors duration-200"
          >
            {club.name}
          </Text>
        </div>
      </div>
    </Link>
  );
}
