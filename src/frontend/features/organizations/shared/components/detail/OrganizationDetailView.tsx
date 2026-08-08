// src/frontend/features/organizations/shared/components/detail/OrganizationDetailView.tsx
import type { ComponentProps } from "react";

import { GenderCategorizedSection } from "@/shared/components/domain";
import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/shared/components/navigation";

import { OrganizationHeader } from "./OrganizationHeader";
import { OrganizationInfo } from "./OrganizationInfo";
import { SearchableChipList } from "./SearchableChipList";

interface OrganizationDetailViewProps {
  readonly breadcrumb: BreadcrumbItem[];
  readonly header: ComponentProps<typeof OrganizationHeader>;
  readonly info: ComponentProps<typeof OrganizationInfo>;
  /** Optional chip list rendered between the info panel and the sections. */
  readonly chipList?: {
    items: { id: number; name: string }[];
    title: string;
    searchPlaceholder: string;
    basePath: string;
    showSearch?: boolean;
  };
  readonly section: ComponentProps<typeof GenderCategorizedSection>;
}

/**
 * Shared body of the three organization detail pages (committee, league,
 * club): breadcrumb, header, info panel, an optional searchable chip list,
 * and a gender-categorized section. The page owns `<PageLayout>` (PageLayout
 * must not be imported into feature components) and shapes `section.items`.
 */
export function OrganizationDetailView({
  breadcrumb,
  header,
  info,
  chipList,
  section,
}: OrganizationDetailViewProps) {
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <OrganizationHeader {...header} />
      <OrganizationInfo {...info} />
      {chipList ? <SearchableChipList {...chipList} /> : null}
      <GenderCategorizedSection {...section} />
    </>
  );
}

export default OrganizationDetailView;
