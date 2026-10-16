// src/frontend/features/organizations/committees/components/list/CommitteeCard.tsx
import { normalizeDepartmentCode } from "@/features/organizations/utils";
import { Badge, Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn, formatCommitteeName, formatNameToFileName } from "@/shared/utils";

import type { Committee } from "../../types";

interface CommitteeCardProps {
  readonly committee: Committee;
  readonly clubLabel: string;
}

/**
 * A committee as a card, with its club count.
 *
 * `clubLabel` arrives already pluralised — the count and its noun are resolved
 * by the caller, because the plural rule belongs to the locale rather than to
 * this component.
 */
export function CommitteeCard({ committee, clubLabel }: CommitteeCardProps) {
  return (
    <Card
      padding="none"
      href={`/organizations/committees/${committee.id}`}
      className={cn(
        "group relative overflow-hidden",
        "border-line-departmental hover:border-solid-departmental",
        "flex",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-20 flex items-center justify-center",
          "bg-gradient-to-br from-[var(--surface-inset)] to-[var(--surface-bg)]",
          "border-r border-white/5",
        )}
      >
        <ImageWithFallback
          src={`/images/committees/${formatNameToFileName(
            committee.name,
          )}.webp`}
          alt={committee.name}
          fallback="/images/committees/defaultLogo.30cc7520.svg"
          className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            "px-4 py-3 border-b border-white/5",
            "bg-tint-departmental",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-solid-departmental" />
            <Text
              variant="label"
              className="font-semibold text-ink-departmental truncate"
            >
              {committee.department?.name ?? committee.department?.code}
            </Text>
          </div>
          <Badge variant="info" size="sm">
            {normalizeDepartmentCode(committee.department.code)}
          </Badge>
        </div>

        <div className="px-4 py-3 flex items-center justify-between gap-3 flex-1">
          <Text
            variant="h3"
            as="h2"
            className="leading-snug line-clamp-2 text-base md:text-lg"
          >
            {formatCommitteeName(committee.name)}
          </Text>
          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-bold text-ink-departmental leading-none">
              {committee.clubCount}
            </p>
            <Text variant="caption" className="mt-0.5">
              {clubLabel}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
