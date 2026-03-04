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
      variant="outline"
      className="inline-flex items-center justify-center w-full box-border border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-100 font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 transition text-center"
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
      className={`z-10 absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <ul className="p-2 text-sm text-gray-900 dark:text-gray-100 font-medium max-h-60 overflow-y-auto text-center">
        {options.map((opt) => (
          <li key={opt.value}>
            <Button
              type="button"
              variant="ghost"
              className={`inline-flex items-center justify-center w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 transition${
                selectedValue === opt.value
                  ? " font-bold text-blue-700 dark:text-blue-400"
                  : ""
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
