// src/frontend/features/competitions/components/detail/CompetitionInfo.tsx
"use client";

import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { InfoBox, Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import { NA } from "@/shared/constants";
import type { President } from "@/shared/types";

interface CompetitionInfoProps {
  readonly president?: President | null;
  readonly address?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
}

export function CompetitionInfo({
  president,
  address,
  email,
  phone,
}: CompetitionInfoProps) {
  const tCompetitions = useTranslations("competitions");

  return (
    <Section title={tCompetitions("info.title")} variant="highlighted">
      {/* Organization contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoBox
          label={tCompetitions("info.address")}
          value={address}
          icon={<MapPinIcon className="w-4 h-4" />}
        />
        <InfoBox
          label={tCompetitions("info.email")}
          value={email}
          href={email ? `mailto:${email}` : undefined}
          icon={<EnvelopeIcon className="w-4 h-4" />}
        />
        <InfoBox
          label={tCompetitions("info.phone")}
          value={phone}
          href={phone ? `tel:${phone}` : undefined}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
      </div>

      {/* President */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <Text variant="overline" as="span">
          {tCompetitions("info.president")}
        </Text>
        <div className="flex-1 h-px bg-divide-light dark:bg-divide-dark" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoBox
          label={tCompetitions("info.presidentName")}
          value={president?.name ?? NA}
          icon={<UserIcon className="w-4 h-4" />}
        />
        <InfoBox
          label={tCompetitions("info.presidentEmail")}
          value={president?.email}
          href={president?.email ? `mailto:${president.email}` : undefined}
          icon={<EnvelopeIcon className="w-4 h-4" />}
        />
        <InfoBox
          label={tCompetitions("info.presidentPhone")}
          value={president?.phone}
          href={president?.phone ? `tel:${president.phone}` : undefined}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
      </div>
    </Section>
  );
}
