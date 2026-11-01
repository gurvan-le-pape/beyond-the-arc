// src/frontend/shared/components/forms/Input.tsx
"use client";

import type { ReactNode } from "react";
import { Input as AriaInput, Label, TextField } from "react-aria-components";

import { cn } from "@/shared/utils";

import { FIELD_ICON, FIELD_INPUT, FIELD_LABEL } from "./fieldStyles";

export interface InputProps {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  /** The native input type; a search box is a `SearchInput`. */
  readonly type?: "text" | "date" | "email" | "number" | "tel" | "url";
  /** Before the text: a decorative icon, sized `w-5 h-5`. */
  readonly icon?: ReactNode;
}

/**
 * A labelled text field, on React Aria's TextField: the label is tied to the
 * input, and `onChange` receives the string.
 *
 * For searching, use `SearchInput`, which adds the clear button and Escape.
 *
 * @example
 * <Input type="date" label="Date" value={date} onChange={setDate} icon={<Calendar className="w-5 h-5" />} />
 */
export function Input({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: InputProps) {
  return (
    <TextField value={value} onChange={onChange} type={type} className="w-full">
      <Label className={FIELD_LABEL}>{label}</Label>
      <div className="relative">
        {icon && <div className={FIELD_ICON}>{icon}</div>}
        <AriaInput className={cn(FIELD_INPUT, icon && "pl-10")} />
      </div>
    </TextField>
  );
}
