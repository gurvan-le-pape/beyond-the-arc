// src/frontend/shared/components/ui/composite/InfoBox.tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * InfoBox component for displaying label-value pairs consistently
 * Used across club pages, team pages, etc.
 */
interface InfoBoxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: string;
  value: string | number | null | undefined;
  href?: string;
  icon?: React.ReactNode;
}

export const InfoBox = forwardRef<HTMLDivElement, InfoBoxProps>(
  ({ label, value, href, icon, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-800 p-4 rounded-card shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700",
          className,
        )}
        {...props}
      >
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <span className="text-gray-500 dark:text-gray-400">{icon}</span>
          )}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
        </div>

        {/* Value */}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
          >
            {value || "N/A"}
          </a>
        ) : (
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {value || "N/A"}
          </p>
        )}
      </div>
    );
  },
);

InfoBox.displayName = "InfoBox";
