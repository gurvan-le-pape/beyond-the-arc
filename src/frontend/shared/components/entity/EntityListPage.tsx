// src/frontend/shared/components/entity/EntityListPage.tsx
import React from "react";

import { Footer, Header } from "@/shared/components/layouts";

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <h1 className="text-title md:text-display font-bold text-primary-600 dark:text-primary-400">
            {title}
          </h1>

          {/* Filters Section */}
          {filters}

          {/* Table Section */}
          {table}

          {/* Pagination Section */}
          {pagination}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EntityListPage;
