// src/frontend/features/competitions/components/carousel/HorizontalCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "@/navigation";
import { Section } from "@/shared/components/ui/composite";
import { SearchInput } from "@/shared/components/ui/forms";
import { Button } from "@/shared/components/ui/primitives";
import { cn } from "@/shared/utils/cn";

import { CarouselItem } from "./CarouselItem";
import { LetterFilter } from "./LetterFilter";

/**
 * HorizontalCarousel
 *
 * A scrollable carousel component for displaying items (leagues, committees, etc.)
 * with optional search and letter filtering capabilities.
 *
 * @example
 * <HorizontalCarousel
 *   items={leagues}
 *   title="Regional Leagues"
 *   imageFolder="leagues"
 *   basePath="/competitions/regional"
 *   currentId={currentId}
 *   enableSearch
 *   enableLetterFilter
 * />
 *
 * Features:
 * - Horizontal scrolling with arrow navigation
 * - Optional search filtering
 * - Optional alphabetical letter filtering
 * - Auto-scroll to active item
 * - Dark mode support
 * - Keyboard accessible
 */

interface HorizontalCarouselProps {
  items: any[];
  title: string;
  imageFolder: string;
  basePath: string;
  currentId?: number;
  enableSearch?: boolean;
  enableLetterFilter?: boolean;
}

export function HorizontalCarousel({
  items,
  title,
  imageFolder,
  basePath,
  currentId,
  enableSearch = false,
  enableLetterFilter = false,
}: HorizontalCarouselProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Auto-select letter based on current item
  useEffect(() => {
    if (
      currentId &&
      items.length > 0 &&
      enableLetterFilter &&
      shouldAutoScroll
    ) {
      const currentItem = items.find(
        (item) => item.id.toString() === currentId.toString(),
      );
      if (currentItem) {
        const text = currentItem.department?.name || currentItem.name;
        setSelectedLetter(text.charAt(0).toUpperCase());
      }
    }
  }, [currentId, items, enableLetterFilter, shouldAutoScroll]);

  // Filter items based on search and letter
  const filteredItems = items.filter((item) => {
    const filterText = item.department?.name || item.name;
    const matchesSearch =
      !searchTerm ||
      filterText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter =
      !selectedLetter || filterText.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  // Get available letters for filtering
  const availableLetters = Array.from(
    new Set(
      items.map((item) => {
        const text = item.department?.name || item.name;
        return text.charAt(0).toUpperCase();
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  // Auto-scroll to active item
  useEffect(() => {
    if (currentId && scrollContainerRef.current && shouldAutoScroll) {
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const activeIndex = filteredItems.findIndex(
          (item) => item.id.toString() === currentId.toString(),
        );
        if (activeIndex !== -1) {
          const itemWidth = 144; // 8rem (w-32) + 0.75rem (gap-3)
          const containerWidth = container.offsetWidth;
          const scrollPosition =
            activeIndex * itemWidth - containerWidth / 2 + itemWidth / 2;
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: "smooth",
          });
          setShouldAutoScroll(false);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [currentId, filteredItems, shouldAutoScroll]);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [filteredItems]);

  // Scroll handlers
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handleItemClick = (itemId: number) => {
    void router.push(`${basePath}/${itemId}`);
  };

  return (
    <Section title={title} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {enableSearch && (
          <div className="w-64">
            <SearchInput
              placeholder="Rechercher…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Letter Filter */}
      {enableLetterFilter && (
        <LetterFilter
          availableLetters={availableLetters}
          selectedLetter={selectedLetter}
          onSelectLetter={(letter) => {
            setSelectedLetter(letter);
            setShouldAutoScroll(false);
          }}
        />
      )}

      {/* Carousel */}
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="carouselArrow"
              size="icon"
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="shadow-lg"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex overflow-x-auto gap-3 py-4",
            "scrollbar-hide", // Hide scrollbar
            canScrollLeft && "pl-12", // Add padding when arrows visible
            canScrollRight && "pr-12",
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {filteredItems.map((item) => (
            <CarouselItem
              key={item.id}
              item={item}
              imageFolder={imageFolder}
              isActive={item.id === currentId}
              onClick={() => handleItemClick(item.id)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="carouselArrow"
              size="icon"
              onClick={scrollRight}
              aria-label="Scroll right"
              className="shadow-lg"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Gradient overlays for visual depth */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />
        )}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
            Aucun résultat
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? `Aucun résultat pour « ${searchTerm} »`
              : "Aucun élément disponible"}
          </p>
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="mt-3"
            >
              Effacer la recherche
            </Button>
          )}
        </div>
      )}
    </Section>
  );
}

export default HorizontalCarousel;
