// src/frontend/features/competitions/components/carousel/SearchableChipsList.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Section } from "@/shared/components/ui/composite/Section";
import { SearchInput } from "@/shared/components/ui/forms";

interface SearchableChipListItem {
  id: number;
  name: string;
}

interface SearchableChipListProps {
  readonly items: SearchableChipListItem[];
  readonly title: string;
  readonly searchPlaceholder: string;
  readonly onItemClick: (item: SearchableChipListItem) => void;
  readonly showSearch?: boolean;
}

export function SearchableChipList({
  items,
  title,
  searchPlaceholder,
  onItemClick,
  showSearch = true,
}: SearchableChipListProps) {
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (items.length === 0) return null;

  return (
    <Section
      title={
        <>
          {title}
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({items.length})
          </span>
        </>
      }
      variant="highlighted"
    >
      {showSearch && (
        <div className="mb-4 max-w-xs">
          <SearchInput
            value={search}
            placeholder={searchPlaceholder}
            onChange={(e) => setSearch(e.target.value)}
            clearAriaLabel={tCommon("clearSearch")}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {filteredItems.length === 0 ? (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {tCompetitions("noSearchResults", { search })}
          </span>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-150"
            >
              {item.name}
            </button>
          ))
        )}
      </div>
    </Section>
  );
}
