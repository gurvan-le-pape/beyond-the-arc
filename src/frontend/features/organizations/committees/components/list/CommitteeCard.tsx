// src/frontend/features/organizations/committees/components/list/CommitteeCard.tsx
import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import type { Committee } from "../../types";

interface CommitteeCardProps {
  readonly committee: Committee;
  readonly clubLabel: string;
}

export function CommitteeCard({ committee, clubLabel }: CommitteeCardProps) {
  const router = useRouter();

  return (
    <Card
      variant="default"
      padding="md"
      clickable
      onClick={() => router.push(`/organizations/committees/${committee.id}`)}
      className="border-l-4 border-l-departmental hover:border-l-departmental-strong"
    >
      <Text variant="h3" className="mb-1">
        {committee.name}
      </Text>
      {committee.department && (
        <Text variant="caption" className="mb-2">
          {committee.department.code}
        </Text>
      )}
      <p className="text-xl font-bold text-departmental-strong">
        {committee.clubCount}
      </p>
      <Text variant="caption">{clubLabel}</Text>
    </Card>
  );
}
