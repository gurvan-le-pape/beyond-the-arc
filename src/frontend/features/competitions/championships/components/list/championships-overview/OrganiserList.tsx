// src/frontend/features/competitions/championships/components/list/championships-overview/OrganiserList.tsx
import { Link } from "@/navigation";
import { cn, onPlainClick } from "@/shared/utils";

import type { Organiser } from "./useOrganisers";

const ACTIVE = {
  regional: "bg-tint-regional",
  departmental: "bg-tint-departmental",
} as const;

interface OrganiserLinkProps {
  readonly organiser: Organiser;
  readonly tone: keyof typeof ACTIVE;
  /** The shape code the map is pointing at, lit up here too. */
  readonly highlighted: string | null;
  readonly onHighlight: (code: string | null) => void;
  readonly hrefFor: (id: number) => string;
  readonly onSelect: (id: number) => void;
}

// One league or committee; a committee leads with its department number.
function OrganiserLink({
  organiser,
  tone,
  highlighted,
  onHighlight,
  hrefFor,
  onSelect,
}: OrganiserLinkProps) {
  const code = organiser.code ?? null;
  return (
    <Link
      href={hrefFor(organiser.id)}
      onClick={onPlainClick(() => onSelect(organiser.id))}
      onMouseEnter={() => onHighlight(code)}
      onMouseLeave={() => onHighlight(null)}
      onFocus={() => onHighlight(code)}
      onBlur={() => onHighlight(null)}
      className={cn(
        "flex items-baseline gap-3 rounded-md px-3 py-1.5 text-text-heading transition-colors focus-ring",
        code !== null && code === highlighted && ACTIVE[tone],
      )}
    >
      {organiser.group !== undefined && (
        <span className="w-7 shrink-0 text-sm text-text-secondary tabular-nums">
          {organiser.code}
        </span>
      )}
      <span className="font-medium">{organiser.name}</span>
    </Link>
  );
}

interface OrganiserListProps extends Omit<OrganiserLinkProps, "organiser"> {
  readonly organisers: readonly Organiser[];
}

/**
 * The leagues or committees to choose from, each a link that opens its
 * championships in place. Committees come grouped by their league's region,
 * in department order; leagues come as one list.
 *
 * The links are the accessible way to choose; the map beside them is a
 * pointer shortcut and shares their highlight.
 */
export function OrganiserList({ organisers, ...link }: OrganiserListProps) {
  const groups = new Map<string, Organiser[]>();
  for (const organiser of organisers) {
    const key = organiser.group ?? "";
    groups.set(key, [...(groups.get(key) ?? []), organiser]);
  }
  const sorted = [...groups].sort(([a], [b]) => a.localeCompare(b));

  // Leagues have no groups: one list, laid out in a grid.
  if (sorted.length === 1 && sorted[0][0] === "") {
    return (
      <ul className="grid sm:grid-cols-2 gap-x-6 surface-subtle border border-divide rounded-card p-3">
        {organisers.map((organiser) => (
          <li key={organiser.id}>
            <OrganiserLink organiser={organiser} {...link} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 gap-6 surface-subtle border border-divide rounded-card p-3">
      {sorted.map(([group, members]) => (
        <section key={group} className="break-inside-avoid mb-3">
          {group && (
            <h3 className="px-3 pt-2 pb-1 text-sm font-semibold text-text-secondary">
              {group}
            </h3>
          )}
          <ul>
            {members.map((organiser) => (
              <li key={organiser.id}>
                <OrganiserLink organiser={organiser} {...link} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
