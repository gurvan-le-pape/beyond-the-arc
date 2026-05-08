// src/frontend/shared/components/domain/organizations/detail/SearchableChipsList.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { Input } from "@/shared/components/forms";
import { Text } from "@/shared/components/typography";

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
          <span className="ml-2 text-sm font-normal text-text-muted">
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
          <Text variant="muted" as="span">
            {tCompetitions("noSearchResults", { search })}
          </Text>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick(item)}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-divide bg-surface-inset text-text-emphasis hover:border-primary hover:text-primary transition-colors duration-150"
            >
              {item.name}
            </button>
          ))
        )}
      </div>
    </Section>
  );
}
