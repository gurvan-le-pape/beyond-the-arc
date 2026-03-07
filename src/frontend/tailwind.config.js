/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode with class strategy
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🎨 DISTINCT COLOR PALETTE - Each category clearly different
      colors: {
        // Primary brand colors (BLUE - for general UI)
        primary: {
          50: "#e6eaf4",
          100: "#c0cae4",
          200: "#97a8d2",
          300: "#6d86c0",
          400: "#4d6bb3",
          500: "#2e51a6",
          600: "#1e3d8f",
          700: "#152d75",
          800: "#0d1f5c",
          900: "#021b50",
          950: "#010f30",
        },

        // Secondary brand colors
        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },

        // GENDER COLORS
        team: {
          male: {
            // BLUE (Sky blue - distinct from primary)
            light: "#38bdf8",
            DEFAULT: "#0ea5e9",
            dark: "#0284c7",
          },
          female: {
            // PINK (Hot pink)
            light: "#f472b6",
            DEFAULT: "#ec4899",
            dark: "#db2777",
          },
        },

        // STATUS COLORS
        success: {
          // GREEN (Emerald green)
          light: "#6ee7b7",
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        error: {
          // RED (Bright red)
          light: "#fca5a5",
          DEFAULT: "#ef4444",
          dark: "#dc2626",
        },
        warning: {
          // ORANGE (Amber orange)
          light: "#fcd34d",
          DEFAULT: "#f59e0b",
          dark: "#d97706",
        },
        info: {
          // CYAN (Bright cyan)
          light: "#67e8f9",
          DEFAULT: "#06b6d4",
          dark: "#0891b2",
        },

        // COMPETITION LEVEL COLORS (Hierarchy)
        national: {
          // INDIGO (Dark blue-purple - highest level)
          light: "#a5b4fc",
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
        },
        regional: {
          // TEAL (Blue-green - regional level)
          light: "#5eead4",
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
        },
        departmental: {
          // YELLOW (Bright yellow - department level)
          light: "#fde047",
          DEFAULT: "#eab308",
          dark: "#ca8a04",
        },

        // CLUBS COLOR
        clubs: {
          // PURPLE (Community/clubs color)
          light: "#c4b5fd",
          DEFAULT: "#a78bfa",
          dark: "#8b5cf6",
        },
      },

      // Custom spacing
      spacing: {
        18: "4.5rem",
        88: "22rem",
        100: "25rem",
        112: "28rem",
        128: "32rem",
      },

      // Custom border radius
      borderRadius: {
        card: "0.75rem", // 12px - for cards
        button: "0.5rem", // 8px - for buttons
        input: "0.375rem", // 6px - for inputs
      },

      // Custom box shadows - Enhanced for dark mode
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "card-dark":
          "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      },

      // Animation
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      // Background colors with opacity support for dark mode
      backgroundColor: {
        "header-light": "rgba(255, 255, 255, 0.9)",
        "header-dark": "rgba(17, 24, 39, 0.9)",
      },
    },
  },

  // Add to plugins array
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          /* Firefox */
          "scrollbar-width": "thin",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
        },
      });
    },
  ],
};
