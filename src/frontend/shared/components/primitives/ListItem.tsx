// src/frontend/shared/components/primitives/ListItem.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { Link } from "@/navigation";

const listItemVariants = cva(
  "group flex w-full items-center gap-3 text-left transition-colors duration-150 " +
    "hover:bg-tint-primary focus-ring-inset",
  {
    variants: {
      size: {
        sm: "min-h-11 px-4 py-2",
        md: "px-4 py-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const TEXT_CLASSES = {
  sm: { title: "text-sm font-medium", description: "text-xs" },
  md: { title: "text-base font-semibold", description: "text-sm" },
} as const;

type ListItemAction =
  | { readonly href: string; readonly onClick?: never }
  | { readonly onClick: () => void; readonly href?: never };

type ListItemProps = ListItemAction &
  VariantProps<typeof listItemVariants> & {
    readonly title: ReactNode;
    /** A secondary line under the title, cut to one line. */
    readonly description?: ReactNode;
    /** Short content at the row's end: a code, a count, an icon. */
    readonly trailing?: ReactNode;
  };

/**
 * One row of a `List`: a title, an optional line under it and an optional
 * trailing item, the whole row a link (`href`) or a button (`onClick`).
 *
 * The hover is the primary tint, so a row reads the same on every surface,
 * including the raised one a `Popover` draws.
 *
 * Takes no `className`: the variants are the whole of its look.
 */
export function ListItem({
  title,
  description,
  trailing,
  size,
  href,
  onClick,
}: Readonly<ListItemProps>) {
  const resolvedSize = size ?? "md";
  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={`truncate text-text-heading group-hover:text-ink-primary ${TEXT_CLASSES[resolvedSize].title}`}
        >
          {title}
        </span>
        {description && (
          <span
            className={`truncate text-text-secondary ${TEXT_CLASSES[resolvedSize].description}`}
          >
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="shrink-0 text-xs text-text-secondary">{trailing}</span>
      )}
    </>
  );
  const className = listItemVariants({ size });

  return (
    // Containment keeps a long list's rows from re-laying out each other.
    <li className="[contain:layout_style_paint]">
      {href === undefined ? (
        <button type="button" onClick={onClick} className={className}>
          {content}
        </button>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}

export default ListItem;
