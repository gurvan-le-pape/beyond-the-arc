// src/frontend/shared/components/entity/EntityListPage.tsx
import React from "react";

interface EntityListPageProps {
  title: React.ReactNode;
  filters: React.ReactNode;
  table: React.ReactNode;
  pagination: React.ReactNode;
}

/**
 * Layout component for entity list pages (players, teams, clubs, etc.)
 * Provides consistent structure with header, filters, table, and pagination
 */
export function EntityListPage({
  title,
  filters,
  table,
  pagination,
}: EntityListPageProps) {
  return (
    <>
      {/* Page Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">
        {title}
      </h1>

      {/* Filters Section */}
      {filters}

      {/* Table Section */}
      {table}

      {/* Pagination Section */}
      {pagination}
    </>
  );
}

export default EntityListPage;
