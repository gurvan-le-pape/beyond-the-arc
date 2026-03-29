// src/frontend/shared/components/entity/table/FilterDropdown.tsx
import type { RefObject } from "react";
import React from "react";

import { Button } from "@/shared/components/ui";

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
      className="inline-flex items-center justify-center w-full text-sm px-4 py-2.5 rounded-xl"
      onClick={() => setOpen(!isOpen)}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <span className="flex-1 text-center">
        {options.find((opt) => opt.value === selectedValue)?.label || label}
      </span>
      <svg
        className="w-4 h-4 ml-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
    <div
      className={`z-10 absolute left-0 mt-2 w-full bg-white dark:bg-surface-raised-dark border border-divide-light dark:border-divide-dark rounded-xl shadow-lg ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <ul className="p-2 text-sm text-text-heading dark:text-text-heading-dark font-medium max-h-60 overflow-y-auto text-center">
        {options.map((opt) => (
          <li key={opt.value}>
            <Button
              type="button"
              variant="ghost"
              className={`inline-flex items-center justify-center w-full p-2 rounded transition ${
                selectedValue === opt.value
                  ? "font-bold text-primary-700 dark:text-primary-400"
                  : "hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark hover:text-primary-700 dark:hover:text-primary-400"
              }`}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              {...(selectedValue === opt.value
                ? { "aria-current": "true" }
                : {})}
            >
              <span className="block w-full">{opt.label}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FilterDropdown;
