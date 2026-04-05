// src/frontend/shared/components/filters/FiltersShell.tsx
"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/shared/components/primitives/Badge";
import { BottomSheet } from "@/shared/components/primitives/BottomSheet";
import { Button } from "@/shared/components/primitives/Button";
import { Card } from "@/shared/components/primitives/Card";
import { cn } from "@/shared/utils/cn";

import type { ActiveFilterChip } from "./ActiveFilterChips";
import { ActiveFilterChips } from "./ActiveFilterChips";

interface FiltersShellProps {
  readonly children: React.ReactNode;
  readonly activeFilterCount: number;
  readonly chips: ActiveFilterChip[];
  readonly onReset: () => void;
  readonly title: string;
}

export function FiltersShell({
  children,
  activeFilterCount,
  chips,
  onReset,
  title,
}: FiltersShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tFilters = useTranslations("filters");

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      {/* Mobile trigger */}
      <div className="md:hidden">
        <Button
          type="button"
          variant="control"
          size="md"
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full justify-between",
            hasActiveFilters &&
              "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400",
          )}
        >
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon
              className={cn(
                "w-5 h-5",
                hasActiveFilters
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-text-muted dark:text-text-muted-dark",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                hasActiveFilters
                  ? "text-primary-700 dark:text-primary-300"
                  : "text-text-body dark:text-text-body-dark",
              )}
            >
              {tFilters("filters.label")}
            </span>
          </div>
          {hasActiveFilters && (
            <Badge variant="primary" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={title}
          footer={
            <div className="flex gap-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                >
                  {tFilters("filters.resetAll")}
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                {tFilters("filters.apply")}
              </Button>
            </div>
          }
        >
          <div className="space-y-5">{children}</div>
        </BottomSheet>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <Card variant="highlighted" padding="lg">
          <div className="space-y-5">
            {children}
            {hasActiveFilters && (
              <ActiveFilterChips chips={chips} onReset={onReset} />
            )}
            {!hasActiveFilters && (
              <div className="pt-1 border-t border-divide-light dark:border-divide-dark">
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {tFilters("filters.noActiveFilters")}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default FiltersShell;
