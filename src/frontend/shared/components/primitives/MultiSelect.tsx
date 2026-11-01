// src/frontend/shared/components/primitives/MultiSelect.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useId, useRef, useState } from "react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import { DROPDOWN_PANEL, DROPDOWN_TRIGGER_BASE } from "./dropdownStyles";
import { SelectChevron } from "./SelectChevron";

export interface MultiSelectColumn {
  /** Column heading (e.g. team name). */
  title: string;
  items: MultiSelectItem[];
}

export interface MultiSelectItem {
  id: number | string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

interface ColumnListProps {
  readonly column: MultiSelectColumn;
}

function ColumnList({ column }: ColumnListProps) {
  const titleId = useId();

  return (
    <div className="min-w-0">
      <Text variant="label" as="h4" id={titleId} className="mb-2">
        {column.title}
      </Text>

      <div
        role="group"
        aria-labelledby={titleId}
        className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide"
      >
        {column.items.map((item) => (
          <label
            key={item.id}
            className={cn(
              "flex items-center gap-2 text-sm p-1 rounded transition-colors duration-150 cursor-pointer",
              "hover:bg-surface-subtle",
            )}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={item.onToggle}
              className="w-4 h-4 text-solid-primary rounded focus-ring"
            />
            <Text variant="label" as="span">
              {item.label}
            </Text>
          </label>
        ))}
      </div>
    </div>
  );
}

export interface MultiSelectProps {
  /** Label shown in the trigger button. */
  readonly label: string;
  /** Number of currently selected items — drives the badge. */
  readonly selectedCount: number;
  /** Called when the user clicks "Clear all". Only rendered when selectedCount > 0. */
  readonly onClear: () => void;
  /** One labelled group of checkboxes each, side by side, divided by rules. */
  readonly columns: MultiSelectColumn[];
  readonly className?: string;
}

/**
 * MultiSelect — generic multi-value column picker, on React Aria's dialog
 * popover.
 *
 * The trigger is named with the selection count ("Players, 2 selected") and
 * opens a panel of native checkboxes, one labelled group per column. React
 * Aria moves focus into the panel, keeps it there, closes it on Escape, a
 * click outside or the close button, and returns focus to the trigger.
 *
 * @example
 * // Two columns (e.g. home/away teams)
 * <MultiSelect
 *   label="Players"
 *   selectedCount={selectedPlayerIds.size}
 *   onClear={() => setSelectedPlayerIds(new Set())}
 *   columns={[homeColumn, awayColumn]}
 * />
 */
export function MultiSelect({
  label,
  selectedCount,
  onClear,
  columns,
  className,
}: MultiSelectProps) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("relative", className)}>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <div className="relative w-fit">
          <Button
            aria-label={t("multiSelectSummary", {
              label,
              count: selectedCount,
            })}
            className={cn(
              DROPDOWN_TRIGGER_BASE,
              "text-left flex items-center gap-2",
              isOpen && "ring-2 ring-solid-primary border-transparent",
            )}
          >
            <span>{label}</span>

            {selectedCount > 0 && (
              <span
                aria-hidden="true"
                className="bg-solid-primary text-on-solid-primary text-xs rounded-button px-2 py-0.5 leading-none"
              >
                {selectedCount}
              </span>
            )}
          </Button>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <SelectChevron open={isOpen} />
          </span>
        </div>

        <Popover
          placement="bottom start"
          offset={4}
          containerPadding={16}
          className={DROPDOWN_PANEL}
        >
          <Dialog aria-label={label} className="p-4 focus-visible:outline-none">
            <div className="flex items-center justify-between mb-3">
              <Text variant="label">{label}</Text>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t("close")}
                className={cn(
                  "h-6 w-6 flex items-center justify-center rounded",
                  "text-text-muted",
                  "hover:text-text-heading",
                  "hover:bg-surface-subtle",
                  "transition-colors duration-150",
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border-t border-divide mb-3" />

            <div className="flex">
              {columns.map((column, index) => (
                <React.Fragment key={column.title}>
                  {index > 0 && (
                    <div className="self-stretch border-l border-divide mx-4" />
                  )}
                  <ColumnList column={column} />
                </React.Fragment>
              ))}
            </div>

            {/* Clear all — only shown when something is selected, so it
                unmounts once clicked; focus moves to the close button
                rather than falling out of the panel. */}
            {selectedCount > 0 && (
              <>
                <div className="border-t border-divide mt-3" />
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    closeRef.current?.focus();
                  }}
                  className={cn(
                    "mt-3 w-full px-3 py-1.5 text-sm rounded-input",
                    "text-ink-error",
                    "hover:bg-tint-error",
                    "focus-ring",
                    "transition-colors duration-150",
                  )}
                >
                  {t("clearSelection")}
                </button>
              </>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
