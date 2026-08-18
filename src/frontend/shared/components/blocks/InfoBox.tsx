// src/frontend/shared/components/blocks/InfoBox.tsx
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";

interface InfoBoxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label: string;
  value: string | number | null | undefined;
  href?: string;
  icon?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * A labelled value in an inset panel — the unit the stat grids are built from.
 *
 * **Expects to sit on `surface-subtle`, inside a Card.** Its own
 * `surface-inset` resolves one step above whatever surface encloses it, so
 * placed directly on the page it renders flat and the inset effect disappears.
 * That is a placement contract, not a default to override.
 *
 * A `null` or `undefined` value renders as `N/A` rather than collapsing, so a
 * grid keeps its shape when a stat is missing. Supplying `href` turns the value
 * into a link that **always opens in a new tab**.
 */
export const InfoBox = ({
  label,
  value,
  href,
  icon,
  className,
  ref,
  ...props
}: InfoBoxProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface-inset",
        "p-4 rounded-card",
        "shadow-card",
        "border border-divide",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-text-secondary">{icon}</span>}
        <Text variant="overline">{label}</Text>
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-strong hover:underline transition-colors"
        >
          {/* h4 = text-lg font-medium text-heading — link overrides color */}
          <Text variant="h4" as="span">
            {value ?? "N/A"}
          </Text>
        </a>
      ) : (
        <Text variant="h4" as="p">
          {value ?? "N/A"}
        </Text>
      )}
    </div>
  );
};
