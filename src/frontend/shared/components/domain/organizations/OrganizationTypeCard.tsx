// src/frontend/shared/components/domain/organizations/OrganizationTypeCard.tsx
import React from "react";

import { Link } from "@/navigation";
import { OrganizationType } from "@/shared/constants";

const COLOR_CLASSES: Record<OrganizationType, string> = {
  [OrganizationType.LEAGUES]:
    "from-regional-subtle to-regional-subtle/40 border-regional hover:border-regional-strong",
  [OrganizationType.COMMITTEES]:
    "from-departmental-subtle to-departmental-subtle/40 border-departmental hover:border-departmental-strong",
  [OrganizationType.CLUBS]:
    "from-clubs-subtle to-clubs-subtle/40 border-clubs hover:border-clubs-strong",
};

export interface OrgType {
  id: OrganizationType;
  label: string;
  description: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  href: string;
}

interface OrganizationTypeCardProps {
  readonly org: OrgType;
}

export function OrganizationTypeCard({ org }: OrganizationTypeCardProps) {
  const { label, description, icon, href, id } = org;

  return (
    <Link
      href={href}
      className={`cursor-pointer bg-gradient-to-br border-2 rounded-card flex flex-col items-center justify-center p-8 transition-all duration-200 hover:scale-105 shadow-card hover:shadow-card-hover group ${COLOR_CLASSES[id]} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface`}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>

      {React.cloneElement(icon, { "aria-hidden": true, focusable: false })}

      <div className="text-xl font-semibold mb-2 group-hover:text-primary-bold transition-colors duration-200 text-text-heading">
        {label}
      </div>

      <div className="text-sm text-text-body text-center">{description}</div>
    </Link>
  );
}
