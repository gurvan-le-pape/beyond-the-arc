// src/frontend/features/competitions/components/detail/SearchableChipsList.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { Input } from "@/shared/components/forms";

interface SearchableChipListItem {
  id: number;
  name: string;
}

interface SearchableChipListProps<T extends SearchableChipListItem> {
  readonly items: T[];
  readonly title: string;
  readonly searchPlaceholder: string;
  readonly onItemClick: (item: T) => void;
  readonly showSearch?: boolean;
}

export function SearchableChipList<T extends SearchableChipListItem>({
  items,
  title,
  searchPlaceholder,
  onItemClick,
  showSearch = true,
}: SearchableChipListProps<T>) {
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
          <span className="ml-2 text-sm font-normal text-text-muted dark:text-text-muted-dark">
            ({items.length})
          </span>
        </>
      }
      variant="highlighted"
    >
      {showSearch && (
        <div className="mb-4 max-w-xs">
          <Input
            variant="search"
            value={search}
            placeholder={searchPlaceholder}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            clearAriaLabel={tCommon("clearSearch")}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {filteredItems.length === 0 ? (
          <span className="text-sm text-text-muted dark:text-text-muted-dark">
            {tCompetitions("noSearchResults", { search })}
          </span>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-divide-light dark:border-divide-dark bg-surface-raised dark:bg-surface-raised-dark text-text-emphasis dark:text-text-emphasis-dark hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-150"
            >
              {item.name}
            </button>
          ))
        )}
      </div>
    </Section>
  );
}
