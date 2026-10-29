// src/frontend/shared/components/primitives/Tabs.tsx
"use client";

import { createContext, useContext, useId, useMemo } from "react";

import { cn } from "@/shared/utils";

// Context for managing tab state
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  /** Stable per-instance prefix, so a page may render several tab sets. */
  baseId: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
};

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

// Main Tabs Container
interface TabsProps {
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * The root of a tab set: publishes the selected tab, and a unique id base,
 * through context.
 *
 * **Controlled.** The caller holds the selected tab — in state, or in the URL
 * as `QueryTabs` does — and `onValueChange` asks it to change.
 *
 * The id base comes from `useId`, so two tab sets on one page cannot collide in
 * their `aria-controls` and `aria-labelledby` wiring.
 */
export function Tabs({
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  const baseId = useId();

  const contextValue = useMemo(
    () => ({ value, onValueChange, baseId }),
    [value, onValueChange, baseId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List (navigation buttons)
interface TabsListProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** Labels the tab list for assistive technology. */
  readonly ariaLabel?: string;
}

/**
 * The `role="tablist"` container that lays the triggers out along a bottom
 * rule.
 *
 * Must wrap `TabsTrigger` elements directly — `TabsTrigger` locates its
 * siblings by walking up to the nearest `[role="tablist"]` for keyboard
 * navigation, so an intervening wrapper breaks the arrow keys.
 */
export function TabsList({
  children,
  className = "",
  ariaLabel,
}: TabsListProps) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <div
        className="flex w-full border-b-2 border-divide"
        role="tablist"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}

// Individual Tab Trigger (button)
interface TabsTriggerProps {
  readonly value: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

/**
 * One tab button, marking itself selected and owning the keyboard pattern for
 * the list.
 *
 * **Arrow keys move focus; Enter or Space activates** — the WAI-ARIA *manual*
 * activation variant. Automatic activation would be wrong here because every
 * consumer writes the tab to the URL, so arrowing across the list would fire a
 * navigation per keypress.
 *
 * Siblings are read from the DOM rather than registered in context, which keeps
 * a tab list declarative: triggers can be rendered conditionally without
 * anything to register or clean up.
 *
 * Requires a `Tabs` ancestor; without one the context lookup throws.
 */
export function TabsTrigger({
  value,
  children,
  className = "",
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, baseId } = useTabsContext();
  const isSelected = selectedValue === value;

  /**
   * Arrow keys move focus; Enter/Space activates — the WAI-ARIA "manual
   * activation" variant. Automatic activation is wrong here: every consumer
   * goes through QueryTabs, which writes the tab to the URL, so arrowing
   * across the list would fire a navigation per keypress.
   *
   * Siblings are read from the DOM rather than tracked in context, so a tab
   * list stays declarative — a consumer can render triggers conditionally
   * without registering and unregistering them.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const list = event.currentTarget.closest('[role="tablist"]');
    if (!list) return;

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const current = tabs.indexOf(event.currentTarget);
    if (current === -1) return;

    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (current + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (current - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      default:
        next = tabs.length - 1;
    }

    event.preventDefault();
    tabs[next].focus();
  };

  return (
    <button
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={panelId(baseId, value)}
      // Roving tabindex: the whole list is one tab stop, and Tab moves past
      // it rather than through every tab.
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onValueChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex-1 py-3 text-sm whitespace-nowrap text-center",
        "border-b-2 -mb-px transition-all duration-200",
        "focus-ring",
        isSelected
          ? "border-solid-primary text-ink-primary font-semibold"
          : "border-transparent text-text-secondary hover:text-text-emphasis hover:border-divide font-normal",
        className,
      )}
    >
      {children}
    </button>
  );
}

// Tab Content Panel
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
 *
 * The panel is focusable so it can be reached from the tab list even when it
 * contains nothing focusable of its own, per the WAI-ARIA tabs pattern.
 */
export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      // Focusable so the panel is reachable from the tab list even when its
      // own content has no focusable element, per the WAI-ARIA tabs pattern.
      tabIndex={0}
      // animate-fade-in, not `animate-in fade-in-50`: those are
      // tailwindcss-animate classes and that plugin is in neither manifest, so
      // both were absent from the built CSS and the panel had no enter
      // animation at all. duration-200 alone did nothing either — a transition
      // duration with no transition and no animation.
      className={cn("animate-fade-in", className)}
    >
      {children}
    </div>
  );
}
