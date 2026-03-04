// src/frontend/features/competitions/components/panels/Panel.tsx
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "@/navigation";
import { SearchInput } from "@/shared/components/ui";
import { NA } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PanelProps {
  items: any[];
  title: string;
  imageFolder: string;
  basePath: string;
  columns?: number;
  enableSearch?: boolean;
  currentId?: string | string[] | undefined;
  currentItemName?: string | null;
  list?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function imgSrc(imageFolder: string, name: string) {
  return `/images/${imageFolder}/${formatNameToFileName(name)}.webp`;
}

function imgFallback(imageFolder: string) {
  return `/images/${imageFolder}/defaultLogo.30cc7520.svg`;
}

function isSelected(
  item: any,
  currentId: string | string[] | undefined,
  currentItemName: string | null | undefined,
) {
  return item.id === currentId || item.name === currentItemName;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Single grid card.
 * - Staggered slide-up via inline animation-delay.
 * - Left-border accent on selection instead of flooding the card with colour.
 * - Shadow lifts on hover; card nudges up 1 px.
 */
function GridCard({
  item,
  imageFolder,
  basePath,
  selected,
  index,
}: {
  item: any;
  imageFolder: string;
  basePath: string;
  selected: boolean;
  index: number;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => void router.push(`${basePath}/${item.id}`)}
      className={cn(
        // base
        "relative w-full flex flex-col items-center rounded-card bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "shadow-card transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        // hover – lift
        "hover:shadow-card-hover hover:-translate-y-1",
        // selected – left accent strip + tinted bg
        selected &&
          "border-l-4 border-l-primary-600 bg-primary-50 dark:bg-primary-950/40",
      )}
      style={{
        animation: "slideUp 0.35s cubic-bezier(.22,1,.36,1) both",
        animationDelay: `${Math.min(index * 45, 300)}ms`,
      }}
    >
      {/* Logo container – rounded square with very light bg */}
      <div className="mt-5 mb-3 w-24 h-24 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-700/50">
        <img
          src={imgSrc(imageFolder, item.name)}
          alt={item.name}
          className="w-20 h-20 object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = imgFallback(imageFolder);
          }}
        />
      </div>

      {/* Name */}
      <span
        className={cn(
          "mb-4 px-3 text-sm font-semibold text-center leading-snug",
          selected
            ? "text-primary-700 dark:text-primary-300"
            : "text-gray-800 dark:text-gray-200",
        )}
      >
        {item.name}
      </span>
    </button>
  );
}

/**
 * Single list row (clubs mode).
 * - Left-border accent on selection, consistent with grid.
 * - Logo in a small rounded container.
 */
function ListRow({
  item,
  imageFolder,
  basePath,
  selected,
  index,
}: {
  item: any;
  imageFolder: string;
  basePath: string;
  selected: boolean;
  index: number;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => void router.push(`${basePath}/${item.id}`)}
      className={cn(
        // base
        "w-full flex items-center gap-4 px-4 py-3 text-left",
        "border-b border-gray-100 dark:border-gray-700 last:border-b-0",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500",
        // hover
        "hover:bg-gray-50 dark:hover:bg-gray-700/40",
        // selected
        selected
          ? "border-l-4 border-l-primary-600 bg-primary-50 dark:bg-primary-950/40"
          : "border-l-4 border-l-transparent",
      )}
      style={{
        animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1) both",
        animationDelay: `${Math.min(index * 30, 250)}ms`,
      }}
    >
      {/* Logo */}
      <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700/60">
        <img
          src={imgSrc(imageFolder, item.name)}
          alt={item.name}
          className="w-8 h-8 object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = imgFallback(imageFolder);
          }}
        />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div
          className={cn(
            "text-sm font-semibold truncate",
            selected
              ? "text-primary-700 dark:text-primary-300"
              : "text-gray-800 dark:text-gray-200",
          )}
        >
          {item.name}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
          {item.city || NA}, {item.zipCode || NA}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export function Panel({
  items,
  title,
  imageFolder,
  basePath,
  columns = 4,
  enableSearch = false,
  currentId,
  currentItemName,
  list = false,
}: PanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Reset search when navigating to a new item
  useEffect(() => {
    setSearchTerm("");
  }, [currentId]);

  const filteredItems = enableSearch
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : items;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Header row: title + count ── */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-subtitle font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <span className="text-caption text-gray-400 dark:text-gray-500">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "résultat" : "résultats"}
        </span>
      </div>

      {/* ── Search ── */}
      {enableSearch && (
        <SearchInput
          placeholder={`Rechercher dans ${title.toLowerCase()}…`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      {/* ── Empty state after search ── */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Aucun résultat pour « {searchTerm} »
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Effacer la recherche
          </button>
        </div>
      )}

      {/* ── Grid or List ── */}
      {filteredItems.length > 0 &&
        (list ? (
          <div className="rounded-card border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card overflow-hidden">
            {filteredItems.map((item, i) => (
              <ListRow
                key={item.id}
                item={item}
                imageFolder={imageFolder}
                basePath={basePath}
                selected={isSelected(item, currentId, currentItemName)}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {filteredItems.map((item, i) => (
              <GridCard
                key={item.id}
                item={item}
                imageFolder={imageFolder}
                basePath={basePath}
                selected={isSelected(item, currentId, currentItemName)}
                index={i}
              />
            ))}
          </div>
        ))}
    </div>
  );
}

export default Panel;
