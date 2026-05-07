// src/frontend/shared/components/primitives/Tabs.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Context for managing tab state
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within Tabs");
  }
  return context;
};

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

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  const contextValue = useMemo(
    () => ({ value, onValueChange: handleChange }),
    [value, handleChange],
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
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <div className="flex w-full border-b-2 border-divide" role="tablist">
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
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={`
        flex-1 py-3 text-sm whitespace-nowrap text-center
        border-b-2 -mb-px transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${
          isSelected
            ? "border-primary-500 text-primary-500 font-semibold"
            : "border-transparent text-text-muted hover:text-text-emphasis hover:border-divide font-normal"
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
  const { value: selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={`animate-in fade-in-50 duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
