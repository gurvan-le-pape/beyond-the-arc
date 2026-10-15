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
    /** Text in the tone: the icon, label, count pill and arrow. */
    ink: string;
    pill: string;
  }
> = {
  [OrganizationType.LEAGUES]: {
    gradient: "from-tint-regional/60 via-surface-subtle to-surface-subtle",
    border: "border-line-regional hover:border-solid-regional",
    iconRing: "ring-line-regional",
    iconBg: "bg-tint-regional",
    ink: "text-ink-regional",
    pill: "bg-tint-regional",
  },
  [OrganizationType.COMMITTEES]: {
    gradient: "from-tint-departmental/60 via-surface-subtle to-surface-subtle",
    border: "border-line-departmental hover:border-solid-departmental",
    iconRing: "ring-line-departmental",
    iconBg: "bg-tint-departmental",
    ink: "text-ink-departmental",
    pill: "bg-tint-departmental",
  },
  [OrganizationType.CLUBS]: {
    gradient: "from-tint-clubs/60 via-surface-subtle to-surface-subtle",
    border: "border-line-clubs hover:border-solid-clubs",
    iconRing: "ring-line-clubs",
    iconBg: "bg-tint-clubs",
    ink: "text-ink-clubs",
    pill: "bg-tint-clubs",
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

/**
 * One of the three organisation types on the landing page, with its count.
 *
 * An **async server component**: it awaits its own translations and locale, so
 * it cannot be rendered inside a client boundary. The count is formatted with
 * the request's locale rather than passed pre-formatted, which is why the
 * locale is needed here at all.
 */
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
        focus-ring
      `}
    >
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
            className: `w-6 h-6 ${s.ink}`,
          })}
        </div>

        {count !== undefined && (
          <span
            className={`
              text-xs font-semibold px-2.5 py-1 rounded-full
              ${s.pill} ${s.ink}
            `}
          >
            {count.toLocaleString(locale)}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-1.5">
        <div className={`text-base font-semibold ${s.ink}`}>{label}</div>
        <div className="text-sm text-text-secondary leading-relaxed">
          {description}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`text-xs font-medium transition-colors duration-200 ${s.ink}`}
        >
          {t("explore")}
        </span>
        <ArrowRight
          aria-hidden
          className={`w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5 ${s.ink}`}
        />
      </div>
    </Link>
  );
}
