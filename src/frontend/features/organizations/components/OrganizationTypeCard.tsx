// src/frontend/features/organizations/components/OrganizationTypeCard.tsx
import {
  ArrowRight,
  Building2,
  type LucideIcon,
  MapPin,
  Users,
} from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Badge, type BadgeProps, Card } from "@/shared/components/primitives";
import { OrganizationType } from "@/shared/constants";

/**
 * Everything one organisation type's card shows besides its count: its icon,
 * link, message keys and the classes of its level tone.
 */
const TYPES: Record<
  OrganizationType,
  {
    icon: LucideIcon;
    labelKey: "leagues.label" | "committees.label" | "clubs.label";
    descriptionKey:
      | "leagues.description"
      | "committees.description"
      | "clubs.description";
    border: string;
    iconRing: string;
    iconBg: string;
    /** Text in the tone: the icon, label and arrow. */
    ink: string;
    badge: NonNullable<BadgeProps["variant"]>;
  }
> = {
  [OrganizationType.LEAGUES]: {
    icon: MapPin,
    labelKey: "leagues.label",
    descriptionKey: "leagues.description",
    border: "border-line-regional hover:border-solid-regional",
    iconRing: "ring-line-regional",
    iconBg: "bg-tint-regional",
    ink: "text-ink-regional",
    badge: "regional",
  },
  [OrganizationType.COMMITTEES]: {
    icon: Building2,
    labelKey: "committees.label",
    descriptionKey: "committees.description",
    border: "border-line-departmental hover:border-solid-departmental",
    iconRing: "ring-line-departmental",
    iconBg: "bg-tint-departmental",
    ink: "text-ink-departmental",
    badge: "departmental",
  },
  [OrganizationType.CLUBS]: {
    icon: Users,
    labelKey: "clubs.label",
    descriptionKey: "clubs.description",
    border: "border-line-clubs hover:border-solid-clubs",
    iconRing: "ring-line-clubs",
    iconBg: "bg-tint-clubs",
    ink: "text-ink-clubs",
    badge: "clubs",
  },
};

interface OrganizationTypeCardProps {
  readonly type: OrganizationType;
  readonly count: number;
}

/**
 * One of the three organisation types on the landing page, with its count.
 *
 * An **async server component**: it awaits its own translations and formatter,
 * so it cannot be rendered inside a client boundary. The count is formatted
 * for the request's locale rather than passed pre-formatted, which is why the
 * formatter is needed here at all.
 */
export async function OrganizationTypeCard({
  type,
  count,
}: OrganizationTypeCardProps) {
  const t = await getTranslations("organizations");
  const format = await getFormatter();
  const { icon: Icon, labelKey, descriptionKey, ...s } = TYPES[type];
  const label = t(labelKey);

  return (
    <Card
      href={`/organizations/${type}`}
      aria-label={label}
      className={`group relative flex flex-col gap-5 ${s.border}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl
            ${s.iconBg} ring-4 ${s.iconRing}
          `}
        >
          <Icon aria-hidden focusable={false} className={`w-6 h-6 ${s.ink}`} />
        </div>

        <Badge variant={s.badge}>{format.number(count)}</Badge>
      </div>

      <div className="flex-1 space-y-1.5">
        <div className={`text-base font-semibold ${s.ink}`}>{label}</div>
        <div className="text-sm text-text-secondary leading-relaxed">
          {t(descriptionKey)}
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
    </Card>
  );
}
