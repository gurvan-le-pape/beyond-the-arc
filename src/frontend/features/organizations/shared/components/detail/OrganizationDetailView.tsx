// src/frontend/features/organizations/shared/components/detail/OrganizationDetailView.tsx
import type { ComponentProps, ReactNode } from "react";

import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/shared/components/navigation";

import { GenderCategorizedSection } from "./gender-categorized-section";
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
  /** Items grouped by gender, then category, under the chip list. */
  readonly section?: ComponentProps<typeof GenderCategorizedSection>;
  /** The page's own content in place of `section`, such as a club's teams. */
  readonly children?: ReactNode;
}

/**
 * Shared body of the three organization detail pages (committee, league,
 * club): breadcrumb, header, info panel, an optional searchable chip list,
 * and then either a gender-categorized section or the page's own children. The page owns `<PageLayout>` (PageLayout
 * must not be imported into feature components) and shapes `section.items`.
 */
export function OrganizationDetailView({
  breadcrumb,
  header,
  info,
  chipList,
  section,
  children,
}: OrganizationDetailViewProps) {
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <OrganizationHeader {...header} />
      <OrganizationInfo {...info} />
      {chipList ? <SearchableChipList {...chipList} /> : null}
      {section ? <GenderCategorizedSection {...section} /> : null}
      {children}
    </>
  );
}

export default OrganizationDetailView;
