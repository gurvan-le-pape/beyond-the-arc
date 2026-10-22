// src/frontend/features/organizations/shared/components/detail/OrganizationDetailView.tsx
import type { ComponentProps, ReactNode } from "react";

import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/shared/components/navigation";

import { OrganizationHeader } from "./OrganizationHeader";
import { OrganizationInfo } from "./OrganizationInfo";
import { SearchableLinkList } from "./SearchableLinkList";

interface OrganizationDetailViewProps {
  readonly breadcrumb: BreadcrumbItem[];
  readonly header: ComponentProps<typeof OrganizationHeader>;
  readonly info: ComponentProps<typeof OrganizationInfo>;
  /** Optional list of links under the info panel: a league's committees or a committee's clubs. */
  readonly linkList?: {
    items: { id: number; name: string }[];
    title: string;
    searchPlaceholder: string;
    basePath: string;
    showSearch?: boolean;
  };
  /** The page's own content under the link list: its teams or championships. */
  readonly children: ReactNode;
}

/**
 * Shared body of the three organization detail pages (committee, league,
 * club): breadcrumb, header, info panel, an optional searchable link list,
 * and then the page's own content. The page owns `<PageLayout>` (PageLayout
 * must not be imported into feature components).
 */
export function OrganizationDetailView({
  breadcrumb,
  header,
  info,
  linkList,
  children,
}: OrganizationDetailViewProps) {
  return (
    <>
      <Breadcrumb items={breadcrumb} />
      <OrganizationHeader {...header} />
      <OrganizationInfo {...info} />
      {linkList ? <SearchableLinkList {...linkList} /> : null}
      {children}
    </>
  );
}

export default OrganizationDetailView;
