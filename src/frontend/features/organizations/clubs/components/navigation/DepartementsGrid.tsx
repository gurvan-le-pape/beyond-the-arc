// src/frontend/features/organizations/clubs/components/navigation/DepartementsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

type Department = {
  id: number;
  name: string;
  clubCount: number;
  department?: { code: string };
};

interface DepartmentsGridProps {
  readonly departments: Department[];
}

/**
 * DepartmentsGrid
 *
 * Displays a grid of department cards with club counts.
 * Each card is clickable and navigates to the clubs list for that department.
 */
export function DepartmentsGrid({ departments }: DepartmentsGridProps) {
  const t = useTranslations("clubs");
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {departments.map((dept) => (
        <Card
          key={dept.id}
          variant="default"
          padding="md"
          clickable
          onClick={() => router.push(`/organizations/committees/${dept.id}`)}
          className="border-l-4 border-l-departmental hover:border-l-departmental-strong"
        >
          <Text variant="h3" className="mb-1">
            {dept.name}
          </Text>
          {dept.department && (
            <Text variant="caption" className="mb-2">
              {dept.department.code}
            </Text>
          )}
          <p className="text-xl font-bold text-departmental-strong">
            {dept.clubCount}
          </p>
          <Text variant="caption">
            {dept.clubCount === 1 ? t("club") : t("clubs")}
          </Text>
        </Card>
      ))}
    </div>
  );
}
