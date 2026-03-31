// src/frontend/shared/components/table/FilterDropdown.tsx
import type { RefObject } from "react";
import React from "react";

import { Button } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  isOpen,
  setOpen,
  dropdownRef,
}) => (
  <div className="relative w-full min-w-[90px]" ref={dropdownRef}>
    <Button
      type="button"
      variant="control"
      className="w-full text-sm px-4 py-2.5 rounded-xl"
      onClick={() => setOpen(!isOpen)}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <span className="flex-1 text-center">
        {options.find((opt) => opt.value === selectedValue)?.label ?? label}
      </span>
      <svg
        className="w-4 h-4 ml-2 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m19 9-7 7-7-7"
        />
      </svg>
    </Button>

    {isOpen && (
      <ul className="absolute left-0 z-10 mt-2 w-full overflow-y-auto max-h-60 rounded-xl border border-divide-light dark:border-divide-dark bg-surface-raised dark:bg-surface-raised-dark shadow-card-hover py-2 text-sm text-center">
        {options.map((opt) => (
          <li key={opt.value}>
            <Button
              type="button"
              variant="ghost"
              aria-pressed={selectedValue === opt.value}
              className={cn(
                "w-full justify-center p-2 rounded",
                selectedValue === opt.value
                  ? "font-bold text-primary-700 dark:text-primary-400"
                  : "hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark",
              )}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </Button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FilterDropdown;
