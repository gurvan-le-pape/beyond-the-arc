// src/frontend/shared/components/layout/EntityListPage.tsx
import React from "react";

import { Text } from "../typography";

interface EntityListPageProps {
  title: React.ReactNode;
  filters: React.ReactNode;
  table: React.ReactNode;
  pagination: React.ReactNode;
}

export function EntityListPage({
  title,
  filters,
  table,
  pagination,
}: EntityListPageProps) {
  return (
    <>
      <Text variant="pageTitle">{title}</Text>
      {filters}
      {table}
      {pagination}
    </>
  );
}

export default EntityListPage;
