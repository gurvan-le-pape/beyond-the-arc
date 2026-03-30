// src/frontend/features/competitions/components/detail/CompetitionHeader.tsx
"use client";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface CompetitionHeaderProps {
  readonly name: string;
  readonly imageFolder: string;
}

export function CompetitionHeader({
  name,
  imageFolder,
}: CompetitionHeaderProps) {
  return (
    <Card variant="highlighted" padding="lg">
      <div className="flex items-center gap-4">
        <img
          src={`/images/${imageFolder}/${formatNameToFileName(name)}.webp`}
          alt=""
          className="w-20 h-20 object-contain flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <Text variant="h1" className="text-xl md:text-2xl">
          {name}
        </Text>
      </div>
    </Card>
  );
}
