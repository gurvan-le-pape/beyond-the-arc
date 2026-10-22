// src/frontend/features/organizations/committees/components/list/CommitteeCard.tsx
import {
  namesMatch,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import { Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatCommitteeName, formatNameToFileName } from "@/shared/utils";

import type { Committee } from "../../types";

interface CommitteeCardProps {
  readonly committee: Committee;
  readonly clubLabel: string;
}

/**
 * A committee as a card: its department's name, the department code, and its
 * club count. The federation's own capitalised name is shown only where it
 * says something the department name does not ("RHONE ET METROPOLE DE LYON").
 *
 * `clubLabel` arrives already pluralised — the count and its noun are resolved
 * by the caller, because the plural rule belongs to the locale rather than to
 * this component.
 */
export function CommitteeCard({ committee, clubLabel }: CommitteeCardProps) {
  const officialName = formatCommitteeName(committee.name);
  const code = normalizeDepartmentCode(committee.department.code);

  return (
    <Card
      padding="none"
      href={`/organizations/committees/${committee.id}`}
      className="group flex items-center gap-4 p-4 border-line-departmental hover:border-solid-departmental"
    >
      <ImageWithFallback
        src={`/images/committees/${formatNameToFileName(committee.name)}.webp`}
        alt=""
        fallback="/images/committees/defaultLogo.30cc7520.svg"
        className="w-12 h-12 flex-shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
      />

      <div className="flex-1 min-w-0">
        <Text
          variant="h3"
          as="h2"
          className="leading-snug truncate text-base md:text-lg"
        >
          {committee.department.name}
        </Text>
        <Text variant="caption" className="mt-0.5 truncate">
          {namesMatch(officialName, committee.department.name)
            ? code
            : `${code} · ${officialName}`}
        </Text>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-2xl font-bold text-ink-departmental leading-none">
          {committee.clubCount}
        </p>
        <Text variant="caption" className="mt-0.5">
          {clubLabel}
        </Text>
      </div>
    </Card>
  );
}
