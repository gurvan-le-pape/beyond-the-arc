// src/frontend/shared/components/filters/CascadeSelects.tsx

import { Select } from "@/shared/components/forms";

export interface CascadeStep {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  enabled: boolean;
  options: { value: string | number; label: string }[];
  allLabel: string;
  waitLabel: string;
}

interface CascadeSelectsProps {
  steps: CascadeStep[];
  cols?: 2 | 3;
}

/**
 * A row of dependent selects, where each step only becomes usable once the one
 * before it has a value — division → pool → matchday, and similar chains.
 *
 * `steps` is ordered: the array *is* the cascade, so the caller decides the
 * dependency chain by ordering it, not by declaring links between steps. A step
 * with `enabled: false` is dimmed and made inert rather than hidden, so the row
 * keeps its shape and controls do not jump sideways as the chain fills in; that
 * step shows its `waitLabel` instead of `allLabel`.
 *
 * The chain is invisible at the call site — `steps={cascadeSteps}` says nothing
 * about what cascades into what — so a call site naming the chain in a comment
 * is expected rather than redundant.
 */
export function CascadeSelects({ steps, cols = 3 }: CascadeSelectsProps) {
  return (
    <div
      className={`grid grid-cols-1 ${
        cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
      } gap-4`}
    >
      {steps.map(
        ({
          id,
          label,
          value,
          onChange,
          enabled,
          options,
          allLabel,
          waitLabel,
        }) => (
          <div
            key={id}
            className={enabled ? undefined : "opacity-40 pointer-events-none"}
          >
            <Select
              label={label}
              value={value}
              onChange={(val) => onChange(String(val ?? ""))}
              disabled={!enabled}
              options={[
                { value: "", label: enabled ? allLabel : waitLabel },
                ...options,
              ]}
            />
          </div>
        ),
      )}
    </div>
  );
}
