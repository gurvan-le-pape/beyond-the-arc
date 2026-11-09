// src/frontend/shared/components/filters/FiltersShell.tsx
"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Badge,
  BottomSheet,
  Button,
  Card,
} from "@/shared/components/primitives";
import { useMediaQuery } from "@/shared/hooks";
import { cn } from "@/shared/utils";

import type { ActiveFilterChip } from "./ActiveFilterChips";
import { ActiveFilterChips } from "./ActiveFilterChips";

// Tailwind's `md` breakpoint.
const DESKTOP_QUERY = "(min-width: 768px)";

interface FiltersSheetProps {
  readonly children: React.ReactNode;
  readonly activeFilterCount: number;
  readonly onReset: () => void;
  readonly title: string;
}

/**
 * The phone layout: a trigger button showing the active-filter count, and the
 * `BottomSheet` it opens. It owns the sheet's open state, so that state goes
 * with it when the window widens and is closed whenever it mounts again.
 */
function FiltersSheet({
  children,
  activeFilterCount,
  onReset,
  title,
}: FiltersSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tFilters = useTranslations("filters");
  const tCommon = useTranslations("common");

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      <Button
        type="button"
        variant="control"
        size="md"
        onPress={() => setIsOpen(true)}
        className={cn(
          "w-full justify-between",
          hasActiveFilters && "border-solid-primary bg-tint-primary",
        )}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className={cn(
              "w-5 h-5",
              hasActiveFilters ? "text-ink-primary" : "text-text-muted",
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              hasActiveFilters ? "text-ink-primary" : "text-text-body",
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
        labels={{
          close: tCommon("close"),
          dragToClose: tCommon("dragToClose"),
        }}
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
                onPress={() => {
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
              onPress={() => setIsOpen(false)}
            >
              {tFilters("filters.apply")}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">{children}</div>
      </BottomSheet>
    </>
  );
}

interface FiltersShellProps {
  readonly children: React.ReactNode;
  /**
   * The one control that must never fold away, such as a page's name search:
   * first in the card, and above the sheet's trigger on a phone instead of
   * inside the sheet.
   */
  readonly lead?: React.ReactNode;
  readonly activeFilterCount: number;
  readonly chips: ActiveFilterChip[];
  readonly onReset: () => void;
  readonly title: string;
}

/**
 * The responsive chrome around a set of filter controls: `FiltersSheet` below
 * `md`, an inline `Card` at `md` and up — exactly one of the two, so
 * `children` and `lead` are never mounted twice.
 *
 * The server cannot see the viewport and renders the card; `hidden md:block`
 * keeps it out of sight on a phone until hydration swaps in the sheet. Filter
 * state belongs to the caller and is passed down, so switching layouts loses
 * nothing.
 */
export function FiltersShell({
  children,
  lead,
  activeFilterCount,
  chips,
  onReset,
  title,
}: FiltersShellProps) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

  if (!isDesktop) {
    const sheet = (
      <FiltersSheet
        activeFilterCount={activeFilterCount}
        onReset={onReset}
        title={title}
      >
        {children}
      </FiltersSheet>
    );
    return lead ? (
      <div className="space-y-4">
        {lead}
        {sheet}
      </div>
    ) : (
      sheet
    );
  }

  return (
    <div className="hidden md:block">
      <Card padding="lg">
        <div className="space-y-5">
          {lead}
          {children}
          {activeFilterCount > 0 && (
            <ActiveFilterChips chips={chips} onReset={onReset} />
          )}
        </div>
      </Card>
    </div>
  );
}
