// src/frontend/shared/components/primitives/MultiSelect.tsx
//
// MultiSelect — multi-value picker with N columns of checkboxes.
//
// The shell handles: trigger, badge count, open/close, click-outside,
// popover animation, header, dividers between columns, and clear button.
//
// Pass 1 column → no divider.
// Pass 2 columns → one divider.
// Pass N columns → N-1 dividers.
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import { DROPDOWN_TRIGGER_BASE } from "./dropdownTriggerBase";
import { Popover } from "./Popover";
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

export interface MultiSelectProps {
  /** Label shown in the trigger button. */
  readonly label: string;
  /** Number of currently selected items — drives the badge. */
  readonly selectedCount: number;
  /** Called when the user clicks "Clear all". Only rendered when selectedCount > 0. */
  readonly onClear: () => void;
  readonly isOpen: boolean;
  readonly setIsOpen: (open: boolean) => void;
  readonly columns: MultiSelectColumn[];
  readonly className?: string;
}

/**
 * MultiSelect — generic multi-value column picker.
 *
 * @example
 * // Single column
 * <MultiSelect
 *   label="Status"
 *   selectedCount={selected.size}
 *   onClear={() => setSelected(new Set())}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   columns={[{
 *     title: "Statuses",
 *     items: statuses.map(s => ({
 *       id: s.id,
 *       label: s.name,
 *       checked: selected.has(s.id),
 *       onToggle: () => toggleStatus(s.id),
 *     })),
 *   }]}
 * />
 *
 * // Two columns (e.g. home/away teams)
 * <MultiSelect
 *   label="Players"
 *   selectedCount={selectedPlayerIds.size}
 *   onClear={() => setSelectedPlayerIds(new Set())}
 *   isOpen={isOpen}
 *   setIsOpen={setIsOpen}
 *   columns={[homeColumn, awayColumn]}
 * />
 */
export function MultiSelect({
  label,
  selectedCount,
  onClear,
  isOpen,
  setIsOpen,
  columns,
  className,
}: MultiSelectProps) {
  const t = useTranslations("common");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className={cn("relative", className)}>
      {/* Trigger — same visual contract as Select and ComboBox */}
      <div className="relative w-fit">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            DROPDOWN_TRIGGER_BASE,
            "text-left flex items-center gap-2",
            isOpen && "ring-2 ring-solid-primary border-transparent",
          )}
        >
          <span>{label}</span>

          {selectedCount > 0 && (
            <span className="bg-solid-primary text-on-solid-primary text-xs rounded-button px-2 py-0.5 leading-none">
              {selectedCount}
            </span>
          )}
        </button>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SelectChevron open={isOpen} />
        </span>
      </div>

      <Popover ref={dropdownRef} open={isOpen}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Text variant="label">{label}</Text>
            <button
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

          {/* N columns with N-1 dividers between them */}
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

          {/* Clear all — only shown when something is selected */}
          {selectedCount > 0 && (
            <>
              <div className="border-t border-divide mt-3" />
              <button
                type="button"
                onClick={onClear}
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
        </div>
      </Popover>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal — column of labelled checkboxes
// ---------------------------------------------------------------------------

interface ColumnListProps {
  readonly column: MultiSelectColumn;
}

function ColumnList({ column }: ColumnListProps) {
  return (
    <div className="min-w-0">
      <Text variant="label" as="h4" className="mb-2">
        {column.title}
      </Text>

      <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
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

export default MultiSelect;
