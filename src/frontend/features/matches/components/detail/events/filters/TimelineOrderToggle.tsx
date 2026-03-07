// src/frontend/features/matches/components/detail/events/filters/TimelineOrderToggle.tsx
import React from "react";

import { Switch } from "@/shared/components/ui";

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
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} size="sm" />
  </div>
);

export default TimelineOrderToggle;
