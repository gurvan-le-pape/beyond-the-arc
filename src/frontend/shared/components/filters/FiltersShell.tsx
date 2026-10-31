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

interface FiltersShellProps {
  readonly children: React.ReactNode;
  readonly activeFilterCount: number;
  readonly chips: ActiveFilterChip[];
  readonly onReset: () => void;
  readonly title: string;
}

/**
 * The responsive chrome around a set of filter controls: a trigger button and
 * `BottomSheet` below `md`, an inline `Card` above it.
 *
 * `children` renders in one place at a time once hydrated: the card on wide
 * screens, the sheet while it is open on narrow ones. The server cannot see
 * the viewport, so it renders the card, which `hidden md:block` keeps out of
 * sight on a phone until hydration removes it. Filter state belongs to the
 * caller and is passed down, so moving between the two loses nothing.
 */
export function FiltersShell({
  children,
  activeFilterCount,
  chips,
  onReset,
  title,
}: FiltersShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);
  const tFilters = useTranslations("filters");

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      <div className="md:hidden">
        <Button
          type="button"
          variant="control"
          size="md"
          onClick={() => setIsOpen(true)}
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
          // Widening the window past `md` hands the filters to the card.
          isOpen={isOpen && !isDesktop}
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

      {isDesktop && (
        <div className="hidden md:block">
          <Card padding="lg">
            <div className="space-y-5">
              {children}
              {hasActiveFilters && (
                <ActiveFilterChips chips={chips} onReset={onReset} />
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
