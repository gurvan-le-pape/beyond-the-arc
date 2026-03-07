// src/frontend/features/matches/components/detail/Tabs.tsx
"use client";

import { createContext, useContext, useState } from "react";

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
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className = "" }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List (navigation buttons)
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`inline-flex items-center justify-start gap-1 bg-white dark:bg-gray-800 rounded-button p-1 border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark mb-6 overflow-x-auto ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

// Individual Tab Trigger (button)
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
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
        px-4 py-2 rounded-button text-sm font-medium whitespace-nowrap
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        ${
          isSelected
            ? "bg-primary-600 text-white shadow-card hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
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
  value: string;
  children: React.ReactNode;
  className?: string;
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
