// src/frontend/features/competitions/components/carousel/CarouselItem.tsx
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface CarouselItemProps {
  item: any;
  imageFolder: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * CarouselItem
 *
 * Individual item card in the carousel.
 * Displays logo and name with active state styling.
 */
export function CarouselItem({
  item,
  imageFolder,
  isActive,
  onClick,
}: CarouselItemProps) {
  const displayName = item.department?.name || item.name;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!isActive}
      className={cn(
        // Base styles
        "flex-shrink-0 w-36 h-40 flex flex-col items-center justify-center gap-3",
        "rounded-card p-4",
        "bg-white dark:bg-gray-800",
        "border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "dark:focus:ring-offset-gray-900",

        // Inactive state
        !isActive && [
          "border-gray-200 dark:border-gray-700",
          "hover:border-primary-300 dark:hover:border-primary-600",
          "hover:shadow-card-hover hover:-translate-y-1",
        ],

        // Active state
        isActive && [
          "border-primary-600 dark:border-primary-500",
          "bg-primary-50 dark:bg-primary-950/40",
          "shadow-card",
        ],
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "w-16 h-16 flex items-center justify-center rounded-lg",
          "transition-colors duration-200",
          isActive
            ? "bg-primary-100 dark:bg-primary-900/50"
            : "bg-gray-50 dark:bg-gray-700/50",
        )}
      >
        <img
          src={`/images/${imageFolder}/${formatNameToFileName(item.name)}.webp`}
          alt={item.name}
          className="w-14 h-14 object-contain"
          draggable="false"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/clubs/defaultLogo.30cc7520.svg";
          }}
        />
      </div>

      {/* Label */}
      <p
        className={cn(
          "text-xs text-center font-medium leading-tight line-clamp-2",
          "transition-colors duration-200",
          isActive
            ? "text-primary-700 dark:text-primary-300"
            : "text-gray-700 dark:text-gray-300",
        )}
      >
        {displayName}
      </p>
    </button>
  );
}
