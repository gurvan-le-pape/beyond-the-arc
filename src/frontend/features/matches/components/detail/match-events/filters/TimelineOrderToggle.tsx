// src/frontend/features/matches/components/detail/match-events/filters/TimelineOrderToggle.tsx
import React from "react";

import { Switch } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface TimelineOrderToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/**
 * Label plus switch for flipping the event timeline's order.
 *
 * **Right-aligns itself** with `ml-auto`, so it expects to be the last child of
 * a flex row and will push away from whatever precedes it. Dropped into a
 * non-flex container it simply sits inline.
 *
 * Carries no opinion about what `checked` means — the caller supplies both the
 * label and the interpretation.
 */
export const TimelineOrderToggle: React.FC<TimelineOrderToggleProps> = ({
  checked,
  onChange,
  label,
}) => (
  <div className="flex items-center gap-2 ml-auto">
    <Text variant="caption" as="span">
      {label}
    </Text>
    <Switch checked={checked} onCheckedChange={onChange} size="sm" />
  </div>
);

export default TimelineOrderToggle;
