// src/frontend/shared/components/primitives/Tabs.tsx
"use client";

import * as RadixTabs from "@radix-ui/react-tabs";

import { cn } from "@/shared/utils";

interface TabsProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * The root of a tab set, on Radix Tabs: it wires the ids, `aria-controls` and
 * `aria-labelledby`, and the keyboard pattern.
 *
 * **Controlled.** The caller holds the selected tab — in state, or in the URL
 * as `QueryTabs` does — and `onValueChange` asks it to change.
 *
 * **Arrow keys move focus; Enter or Space activates** — the WAI-ARIA *manual*
 * activation variant. Automatic activation would select a tab per keypress
 * while arrowing across the list, and `QueryTabs` writes each one to the URL.
 */
export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root
      value={value}
      onValueChange={onValueChange}
      activationMode="manual"
      className={className}
    >
      {children}
    </RadixTabs.Root>
  );
}

interface TabsListProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** Labels the tab list for assistive technology. */
  readonly ariaLabel?: string;
}

/** The `role="tablist"` container that lays the triggers out along a bottom rule. */
export function TabsList({ children, className, ariaLabel }: TabsListProps) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <RadixTabs.List
        className="flex w-full border-b-2 border-divide"
        aria-label={ariaLabel}
      >
        {children}
      </RadixTabs.List>
    </div>
  );
}

interface TabsTriggerProps {
  readonly value: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/** One tab button; styled from Radix's `data-state`. */
export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        "flex-1 py-3 text-sm whitespace-nowrap text-center",
        "border-b-2 -mb-px transition-all duration-200",
        "focus-ring",
        "border-transparent text-text-secondary font-normal hover:text-text-emphasis hover:border-divide",
        "data-[state=active]:border-solid-primary data-[state=active]:text-ink-primary data-[state=active]:font-semibold",
        "data-[state=active]:hover:border-solid-primary data-[state=active]:hover:text-ink-primary",
        className,
      )}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

interface TabsContentProps {
  readonly value: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * One tab panel, rendered only while its tab is selected.
 *
 * **The inactive panel is unmounted, not hidden.** Anything it holds — scroll
 * position, an open dropdown, uncommitted input, an in-flight component state —
 * is discarded on every tab switch and rebuilt on return. State that must
 * survive belongs above the tabs or in the URL.
 */
export function TabsContent({ value, children, className }: TabsContentProps) {
  return (
    <RadixTabs.Content
      value={value}
      // animate-fade-in, not `animate-in fade-in-50`: those are
      // tailwindcss-animate classes and that plugin is in neither manifest.
      className={cn("animate-fade-in", className)}
    >
      {children}
    </RadixTabs.Content>
  );
}
