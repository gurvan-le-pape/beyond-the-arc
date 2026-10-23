// src/frontend/shared/components/stats/Stat.tsx
import { Text } from "@/shared/components/typography";

interface StatProps {
  readonly value: string;
  readonly label: string;
  /**
   * The label written out, when `label` is an abbreviation: it becomes the
   * abbreviation's title, so the short form stays explained on hover and to
   * assistive technology.
   */
  readonly fullLabel?: string;
  /**
   * When true, renders the vertical layout used in the map stats block
   * (items-center, gap-0.5, larger value text).
   * Defaults to false — the horizontal band layout.
   */
  readonly compact?: boolean;
}

/**
 * A single number with its label beneath, for stat bands and map summaries.
 *
 * `value` is a string, not a number: formatting — decimals, separators, units —
 * belongs to the caller, so this never rounds or reformats what it is given.
 *
 * The `compact` layout is smaller and tighter for dense blocks. Note it does
 * **not** apply `tabular-nums`, which the default layout does, so a compact row
 * of changing numbers can shift by a pixel between renders.
 */
export function Stat({ value, label, fullLabel, compact = false }: StatProps) {
  const labelText = fullLabel ? (
    <abbr title={fullLabel} className="no-underline">
      {label}
    </abbr>
  ) : (
    label
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-0.5 items-center">
        <span className="text-lg font-extrabold leading-none text-text-heading">
          {value}
        </span>
        <Text variant="overline">{labelText}</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
      <span className="text-2xl font-extrabold leading-none text-text-heading tabular-nums">
        {value}
      </span>
      <Text variant="overline" className="mt-1">
        {labelText}
      </Text>
    </div>
  );
}
