// src/frontend/features/competitions/championships/components/detail/ChampionshipBreadcrumb.tsx
import { useTranslations } from "next-intl";

import { Breadcrumb } from "@/shared/components/navigation";

interface ChampionshipBreadcrumbProps {
  readonly name: string;
}

/**
 * The trail above a championship detail page.
 *
 * Takes the finished name rather than the championship, because the caller has
 * already assembled it for the heading and the document title — deriving it a
 * second time here would let the two disagree.
 */
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
