// src/frontend/shared/components/filters/CascadeSelect.tsx

import { Select } from "@/shared/components/forms";
import type {
  ComboBoxOption,
  OptionValue,
} from "@/shared/components/primitives";

interface CascadeSelectProps<V extends OptionValue> {
  readonly label: string;
  readonly value: V | undefined;
  readonly onChange: (value: V | undefined) => void;
  /** Whether the step it depends on has a value yet. */
  readonly enabled: boolean;
  readonly options: ComboBoxOption<NoInfer<V>>[];
  readonly allLabel: string;
  /** Shown instead of `allLabel` while the step is not enabled. */
  readonly waitLabel: string;
}

/**
 * One step of a chain of dependent selects — division → pool → matchday — that
 * only becomes usable once the step before it has a value. The caller renders
 * the steps in order and passes each one's `enabled`.
 *
 * A step that is not enabled is dimmed and made inert rather than hidden, so
 * the row keeps its shape and controls do not jump sideways as the chain fills
 * in.
 */
export function CascadeSelect<V extends OptionValue>({
  label,
  value,
  onChange,
  enabled,
  options,
  allLabel,
  waitLabel,
}: CascadeSelectProps<V>) {
  return (
    <div className={enabled ? undefined : "opacity-40 pointer-events-none"}>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        disabled={!enabled}
        options={[
          { value: undefined, label: enabled ? allLabel : waitLabel },
          ...options,
        ]}
      />
    </div>
  );
}
