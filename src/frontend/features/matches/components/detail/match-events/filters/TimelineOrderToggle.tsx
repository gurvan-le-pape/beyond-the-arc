// src/frontend/features/matches/components/detail/match-events/filters/TimelineOrderToggle.tsx
import React from "react";

import { Switch } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface TimelineOrderToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

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
