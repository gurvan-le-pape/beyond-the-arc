// src/frontend/shared/components/forms/NumberField.tsx
"use client";

import {
  Input as AriaInput,
  Label,
  NumberField as AriaNumberField,
} from "react-aria-components";

import { FIELD_INPUT, FIELD_LABEL } from "./fieldStyles";

export interface NumberFieldProps {
  readonly label: string;
  /** `undefined` while the field is empty. */
  readonly value: number | undefined;
  /** The committed number, or `undefined` once the field is emptied. */
  readonly onChange: (value: number | undefined) => void;
  readonly minValue?: number;
  readonly placeholder?: string;
}

/**
 * A labelled whole-number field, on React Aria's NumberField.
 *
 * `onChange` fires when an edit is committed — on blur or Enter — not on each
 * keystroke, so typing "23" reports 23 once rather than 2 and then 23. Text
 * that is not a number is rejected as it is typed.
 */
export function NumberField({
  label,
  value,
  onChange,
  minValue,
  placeholder,
}: NumberFieldProps) {
  return (
    <AriaNumberField
      // React Aria's empty value is NaN.
      value={value ?? Number.NaN}
      onChange={(next) => onChange(Number.isNaN(next) ? undefined : next)}
      minValue={minValue}
      step={1}
      formatOptions={{ useGrouping: false, maximumFractionDigits: 0 }}
      className="w-full"
    >
      <Label className={FIELD_LABEL}>{label}</Label>
      <AriaInput className={FIELD_INPUT} placeholder={placeholder} />
    </AriaNumberField>
  );
}
