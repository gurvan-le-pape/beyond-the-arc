// src/frontend/features/competitions/championships/components/detail/championship-breadcrumb/index.tsx
import { useTranslations } from "next-intl";

import { Breadcrumb } from "@/shared/components/navigation";

interface ChampionshipBreadcrumbProps {
  readonly name: string;
}

export function ChampionshipBreadcrumb({ name }: ChampionshipBreadcrumbProps) {
  const tCompetitions = useTranslations("competitions");

  return (
    <Breadcrumb
      items={[
        { label: tCompetitions("breadcrumb"), href: "/championships" },
        { label: name, current: true },
      ]}
    />
  );
}
