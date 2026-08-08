// src/frontend/shared/components/primitives/Tabs.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";

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
  readonly defaultValue: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly onValueChange?: (value: string) => void; // optional external handler
}

export function Tabs({
  defaultValue,
  children,
  className = "",
  onValueChange,
}: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  const baseId = useId();

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  const contextValue = useMemo(
    () => ({ value, onValueChange: handleChange, baseId }),
    [value, handleChange, baseId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
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

export function TabsList({
  children,
  className = "",
  ariaLabel,
}: TabsListProps) {
  return (
    <div className={`flex justify-center mb-6 ${className}`}>
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
      className={`
        flex-1 py-3 text-sm whitespace-nowrap text-center
        border-b-2 -mb-px transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${
          isSelected
            ? "border-primary text-primary font-semibold"
            : "border-transparent text-text-secondary hover:text-text-emphasis hover:border-divide font-normal"
        }
        ${className}
      `}
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
      className={`animate-in fade-in-50 duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
