// src/frontend/shared/components/layouts/header/ThemeToggle.tsx
"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Theme toggle button
 * Switches between light and dark mode with smooth transitions
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5" /> {/* Placeholder to prevent layout shift */}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5 text-warning-DEFAULT transition-transform duration-200 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
}
