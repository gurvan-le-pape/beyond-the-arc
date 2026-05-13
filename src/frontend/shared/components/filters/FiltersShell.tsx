// src/frontend/shared/components/filters/FiltersShell.tsx
"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge, BottomSheet, Button, Card } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

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
            hasActiveFilters && "border-primary bg-primary-subtle",
          )}
        >
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon
              className={cn(
                "w-5 h-5",
                hasActiveFilters ? "text-primary" : "text-text-muted",
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                hasActiveFilters ? "text-primary-strong" : "text-text-body",
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
              <div className="pt-1 border-t border-divide">
                <span className="text-xs text-text-muted">
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
