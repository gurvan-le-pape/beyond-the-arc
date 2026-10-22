// src/frontend/shared/components/domain/ClubMark.tsx
import type { CSSProperties } from "react";

import { clubHue, clubInitials, cn } from "@/shared/utils";

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl md:w-24 md:h-24 md:text-3xl",
} as const;

interface ClubMarkProps {
  readonly clubName: string | null | undefined;
  readonly size?: keyof typeof SIZE_CLASSES;
}

/**
 * A club, drawn as its monogram on a colour of its own.
 *
 * The visual of a page that heads with a club or a team — the club, team,
 * player and match headers — where there are no club logos to show. It is
 * not drawn in lists or tables: thousands of clubs share a few hundred pairs
 * of initials, so beside a written name it adds nothing that tells clubs
 * apart. The colours per theme live in `globals.css` (`.club-mark`), keyed on
 * the `--club-hue` set here, and are contrast-tested for every hue.
 *
 * Decorative: the club's name is always written next to it or on the link
 * around it, so the mark is hidden from assistive technology.
 */
export function ClubMark({ clubName, size = "md" }: ClubMarkProps) {
  const name = clubName ?? "";
  const style = { "--club-hue": clubHue(name) } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        "club-mark inline-flex shrink-0 items-center justify-center rounded-button font-bold tracking-tight select-none",
        SIZE_CLASSES[size],
      )}
    >
      {clubInitials(name)}
    </span>
  );
}

export default ClubMark;
