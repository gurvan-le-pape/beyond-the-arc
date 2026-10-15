// src/frontend/shared/components/blocks/IconTile.tsx
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/utils";

const tileVariants = cva(
  "inline-flex items-center justify-center shrink-0 rounded-button bg-tint-primary text-ink-primary",
  {
    variants: {
      size: {
        md: "w-12 h-12 [&>svg]:w-6 [&>svg]:h-6",
        lg: "w-16 h-16 [&>svg]:w-8 [&>svg]:h-8",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface IconTileProps {
  readonly icon: LucideIcon;
  /** `md` heads a card, `lg` a page. */
  readonly size?: "md" | "lg";
}

/**
 * The square that carries an icon at the head of a card or a page, in the
 * brand's tint. One look for every such tile: the icon is the subject's
 * marker, not a colour code, so tiles do not vary their hue.
 *
 * @returns the decorative tile, hidden from assistive technology
 */
export function IconTile({ icon: Icon, size = "md" }: IconTileProps) {
  return (
    <div className={cn(tileVariants({ size }))} aria-hidden>
      <Icon />
    </div>
  );
}

export default IconTile;
