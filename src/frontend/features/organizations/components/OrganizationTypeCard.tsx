// src/frontend/features/organizations/components/OrganizationTypeCard.tsx
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

import { Link } from "@/navigation";
import { OrganizationType } from "@/shared/constants";

const STYLES: Record<
  OrganizationType,
  {
    gradient: string;
    border: string;
    iconRing: string;
    iconBg: string;
    accent: string;
    arrow: string;
    pill: string;
    pillText: string;
  }
> = {
  [OrganizationType.LEAGUES]: {
    gradient: "from-regional-subtle/60 via-surface-subtle to-surface-subtle",
    border: "border-regional/30 hover:border-regional",
    iconRing: "ring-regional/20",
    iconBg: "bg-regional-subtle",
    accent: "text-regional-strong",
    arrow: "text-regional group-hover:text-regional-strong",
    pill: "bg-regional-subtle",
    pillText: "text-regional-strong",
  },
  [OrganizationType.COMMITTEES]: {
    gradient:
      "from-departmental-subtle/60 via-surface-subtle to-surface-subtle",
    border: "border-departmental/30 hover:border-departmental",
    iconRing: "ring-departmental/20",
    iconBg: "bg-departmental-subtle",
    accent: "text-departmental-strong",
    arrow: "text-departmental group-hover:text-departmental-strong",
    pill: "bg-departmental-subtle",
    pillText: "text-departmental-strong",
  },
  [OrganizationType.CLUBS]: {
    gradient: "from-clubs-subtle/60 via-surface-subtle to-surface-subtle",
    border: "border-clubs/30 hover:border-clubs",
    iconRing: "ring-clubs/20",
    iconBg: "bg-clubs-subtle",
    accent: "text-clubs-strong",
    arrow: "text-clubs group-hover:text-clubs-strong",
    pill: "bg-clubs-subtle",
    pillText: "text-clubs-strong",
  },
};

export interface OrgType {
  id: OrganizationType;
  label: string;
  description: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  href: string;
  count?: number;
}

interface OrganizationTypeCardProps {
  readonly org: OrgType;
}

export async function OrganizationTypeCard({ org }: OrganizationTypeCardProps) {
  const t = await getTranslations("organizations");
  const locale = await getLocale();
  const { label, description, icon, href, id, count } = org;
  const s = STYLES[id];

  return (
    <Link
      href={href}
      aria-label={label}
      className={`
        group relative flex flex-col gap-5 p-6 rounded-card
        bg-gradient-to-br ${s.gradient}
        border ${s.border}
        shadow-card hover:shadow-card-hover
        transition-all duration-300 ease-out
        hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface
      `}
    >
      {/* Top row: icon + optional count pill */}
      <div className="flex items-start justify-between">
        <div
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl
            ${s.iconBg} ring-4 ${s.iconRing}
          `}
        >
          {React.cloneElement(icon, {
            "aria-hidden": true,
            focusable: false,
            className: `w-6 h-6 ${s.accent}`,
          })}
        </div>

        {count !== undefined && (
          <span
            className={`
              text-xs font-semibold px-2.5 py-1 rounded-full
              ${s.pill} ${s.pillText}
            `}
          >
            {count.toLocaleString(locale)}
          </span>
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 space-y-1.5">
        <div className={`text-base font-semibold ${s.accent}`}>{label}</div>
        <div className="text-sm text-text-secondary leading-relaxed">
          {description}
        </div>
      </div>

      {/* Bottom arrow */}
      <div className="flex items-center gap-1.5">
        <span
          className={`text-xs font-medium transition-colors duration-200 ${s.arrow}`}
        >
          {t("explore")}
        </span>
        <ArrowRight
          aria-hidden
          className={`w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5 ${s.arrow}`}
        />
      </div>
    </Link>
  );
}
