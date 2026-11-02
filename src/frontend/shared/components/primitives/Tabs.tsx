// src/frontend/shared/components/primitives/Tabs.tsx
"use client";

import type { ReactNode } from "react";
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
} from "react-aria-components";

import { cn } from "@/shared/utils";

interface TabsProps {
  readonly selectedKey: string;
  readonly onSelectionChange: (key: string) => void;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * The root of a tab set, on React Aria's Tabs: it wires the ids,
 * `aria-controls` and `aria-labelledby`, and the keyboard pattern.
 *
 * **Controlled.** The caller holds the selected tab — in state, or in the URL
 * as `QueryTabs` does — and `onSelectionChange` asks it to change.
 *
 * **Arrow keys move focus; Enter or Space activates** — the WAI-ARIA *manual*
 * activation variant. Automatic activation would select a tab per keypress
 * while arrowing across the list, and `QueryTabs` writes each one to the URL.
 */
export function Tabs({
  selectedKey,
  onSelectionChange,
  children,
  className,
}: TabsProps) {
  return (
    <AriaTabs
      selectedKey={selectedKey}
      onSelectionChange={(key) => onSelectionChange(String(key))}
      keyboardActivation="manual"
      className={className}
    >
      {children}
    </AriaTabs>
  );
}

interface TabListProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Labels the tab list for assistive technology. */
  readonly ariaLabel?: string;
}

/** The `role="tablist"` container that lays the tabs out along a bottom rule. */
export function TabList({ children, className, ariaLabel }: TabListProps) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <AriaTabList
        className="flex w-full border-b-2 border-divide"
        aria-label={ariaLabel}
      >
        {children}
      </AriaTabList>
    </div>
  );
}

interface TabProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** One tab; styled from React Aria's `data-selected`. */
export function Tab({ id, children, className }: TabProps) {
  return (
    <AriaTab
      id={id}
      className={cn(
        "flex-1 cursor-pointer py-3 text-sm whitespace-nowrap text-center",
        "border-b-2 -mb-px transition-all duration-200",
        "focus-ring",
        "border-transparent text-text-secondary font-normal hover:text-text-emphasis hover:border-divide",
        "data-[selected]:border-solid-primary data-[selected]:text-ink-primary data-[selected]:font-semibold",
        "data-[selected]:hover:border-solid-primary data-[selected]:hover:text-ink-primary",
        className,
      )}
    >
      {children}
    </AriaTab>
  );
}

interface TabPanelProps {
  readonly id: string;
  readonly children: ReactNode;
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
export function TabPanel({ id, children, className }: TabPanelProps) {
  return (
    <AriaTabPanel
      id={id}
      // animate-fade-in, not `animate-in fade-in-50`: those are
      // tailwindcss-animate classes and that plugin is in neither manifest.
      className={cn("animate-fade-in", className)}
    >
      {children}
    </AriaTabPanel>
  );
}
