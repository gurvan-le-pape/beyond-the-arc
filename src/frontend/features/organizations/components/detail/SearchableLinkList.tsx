// src/frontend/features/organizations/components/detail/SearchableLinkList.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Section } from "@/shared/components/blocks";
import { SearchInput } from "@/shared/components/forms";
import { TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface SearchableLinkListItem {
  id: number;
  name: string;
}

interface SearchableLinkListProps<T extends SearchableLinkListItem> {
  readonly items: T[];
  readonly title: string;
  readonly searchPlaceholder: string;
  readonly basePath: string;
  readonly showSearch?: boolean;
}

/**
 * A filterable list of links, used for the committees and clubs under an
 * organisation. The names flow down one to four columns, so a committee's
 * fifty clubs read as an index rather than a wall of buttons.
 *
 * Filtering is **client-side over the whole list** — everything is already
 * loaded, so there is no query behind the box and the list is expected to stay
 * small enough to hold in memory.
 *
 * `basePath` is joined with each item's id to build its href, so the items need
 * carry only an id and a name.
 *
 * @typeParam T - the item shape, which must expose `id` and `name`
 */
export function SearchableLinkList<T extends SearchableLinkListItem>({
  items,
  title,
  searchPlaceholder,
  basePath,
  showSearch = true,
}: SearchableLinkListProps<T>) {
  const tCompetitions = useTranslations("competitions");

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
    >
      {showSearch && (
        <div className="mb-4 max-w-xs">
          <SearchInput
            aria-label={title}
            value={search}
            placeholder={searchPlaceholder}
            onChange={setSearch}
          />
        </div>
      )}
      {filteredItems.length === 0 ? (
        <Text variant="caption" as="p">
          {tCompetitions("noSearchResults", { search })}
        </Text>
      ) : (
        <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-3 xl:columns-4">
          {filteredItems.map((item) => (
            <li key={item.id} className="break-inside-avoid py-1.5 text-sm">
              <TextLink href={`${basePath}/${item.id}`} variant="plain">
                {item.name}
              </TextLink>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
