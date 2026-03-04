// src/frontend/features/organizations/clubs/components/navigation/DepartementsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";
import { Card } from "@/shared/components/ui";

type Department = {
  id: number;
  name: string;
  clubCount: number;
  department?: { code: string };
};

interface DepartmentsGridProps {
  departments: Department[];
  leagueId: number;
}

/**
 * DepartmentsGrid
 *
 * Displays a grid of department cards with club counts.
 * Each card is clickable and navigates to the clubs list for that department.
 */
export function DepartmentsGrid({
  departments,
  leagueId,
}: DepartmentsGridProps) {
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
          onClick={() =>
            router.push(`/clubs/league/${leagueId}/committee/${dept.id}`)
          }
          className="border-l-4 border-l-departmental-dark dark:border-l-departmental-light hover:border-l-gray-300 dark:hover:!border-l-gray-600"
        >
          <h3 className="text-body-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {dept.name}
          </h3>
          {dept.department && (
            <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-2">
              {dept.department.code}
            </p>
          )}
          <p className="text-subtitle font-bold text-departmental-dark dark:text-departmental-light">
            {dept.clubCount}
          </p>
          <p className="text-body-sm text-gray-600 dark:text-gray-400">
            {dept.clubCount === 1 ? t("club") : t("clubs")}
          </p>
        </Card>
      ))}
    </div>
  );
}
