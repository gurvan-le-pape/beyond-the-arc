// src/frontend/features/organizations/shared/components/detail/SearchableChipList.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/navigation";
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
  readonly basePath: string;
  readonly showSearch?: boolean;
}

export function SearchableChipList<T extends SearchableChipListItem>({
  items,
  title,
  searchPlaceholder,
  basePath,
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
          <span className="ml-2 text-sm font-normal text-text-secondary">
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
          <Text variant="caption" as="span">
            {tCompetitions("noSearchResults", { search })}
          </Text>
        ) : (
          filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`${basePath}/${item.id}`}
              className="px-3 py-2 rounded-lg text-sm font-medium border border-divide bg-surface-inset text-text-emphasis hover:border-primary hover:text-primary transition-colors duration-150"
            >
              {item.name}
            </Link>
          ))
        )}
      </div>
    </Section>
  );
}
