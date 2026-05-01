// src/frontend/shared/components/filters/CascadeSelects.tsx
import React from "react";

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

export const CascadeSelects: React.FC<CascadeSelectsProps> = ({
  steps,
  cols = 3,
}) => (
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
