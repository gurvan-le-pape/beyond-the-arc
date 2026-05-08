// src/frontend/features/organizations/clubs/components/list/ClubCard.tsx
import { Link } from "@/navigation";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubCardProps {
  readonly club: ClubBasic;
}

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Link
      href={`/organizations/clubs/${club.id}`}
      className="group flex flex-col gap-2 p-4 rounded-card border border-divide border-l-4 border-l-clubs surface-subtle hover:shadow-card-hover hover:scale-[1.01] transition-all duration-200 shadow-card"
    >
      <div className="font-semibold text-text-heading group-hover:text-primary-strong transition-colors duration-200 leading-snug">
        {club.name}
      </div>
      {(club.city || club.zipCode) && (
        <div className="text-sm text-text-secondary">
          {[club.zipCode, club.city].filter(Boolean).join(" · ")}
        </div>
      )}
    </Link>
  );
}
