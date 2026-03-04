// src/frontend/shared/components/layouts/header/HamburgerButton.tsx
import React from "react";

interface HamburgerButtonProps {
  open: boolean;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ open }) => (
  <span className="relative w-6 h-6 block">
    <span
      className={`absolute left-0 top-1 w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${
        open ? "rotate-45 top-3" : ""
      }`}
    />
    <span
      className={`absolute left-0 top-3 w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${
        open ? "opacity-0" : ""
      }`}
    />
    <span
      className={`absolute left-0 top-5 w-6 h-0.5 bg-gray-700 dark:bg-gray-300 rounded transition-all duration-300 ${
        open ? "-rotate-45 top-3" : ""
      }`}
    />
  </span>
);

export default HamburgerButton;
