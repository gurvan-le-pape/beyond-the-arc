// src/frontend/shared/components/blocks/InfoBox.tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";

/**
 * InfoBox — label/value pair block.
 *
 * Elevation: sits on surface-subtle (inside a Card). This is intentional —
 * surface-raised is one step above surface-subtle, giving the inset effect.
 * Do not place InfoBox directly on the page (surface-base) or the elevation
 * will look wrong. See the token guide for the nesting convention.
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
          "bg-surface-inset",
          "p-4 rounded-card",
          "shadow-card",
          "border border-divide",
          className,
        )}
        {...props}
      >
        {/* Label row */}
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-text-secondary">{icon}</span>}
          {/* overline = text-xs uppercase tracking-widest text-secondary — matches exactly */}
          <Text variant="overline">{label}</Text>
        </div>

        {/* Value */}
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
  },
);

InfoBox.displayName = "InfoBox";
