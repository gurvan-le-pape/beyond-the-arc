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

        surface: {
          base: "#f9fafb", // gray-50
          subtle: "#f3f4f6", // gray-100
          raised: "#e5e7eb", // gray-200
          "base-dark": "#030712", // gray-950
          "subtle-dark": "#111827", // gray-900
          "raised-dark": "#1f2937", // gray-800
        },

        divide: {
          light: "#d1d5db", // gray-300 — borders, dividers
          dark: "#374151", // gray-700 — dark borders, dividers
        },

        // TEXT TOKENS
        text: {
          muted: "#9ca3af", // gray-400 — placeholders, disabled, icons
          secondary: "#6b7280", // gray-500 — secondary labels, captions
          body: "#4b5563", // gray-600 — default body text
          emphasis: "#374151", // gray-700 — stronger labels
          heading: "#1f2937", // gray-800 — headings
          "muted-dark": "#6b7280", // gray-500
          "secondary-dark": "#9ca3af", // gray-400
          "body-dark": "#d1d5db", // gray-300
          "emphasis-dark": "#e5e7eb", // gray-200
          "heading-dark": "#f3f4f6", // gray-100
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

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },

      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // Custom spacing
      spacing: {
        sidebar: "22rem",
        panel: "25rem",
        "panel-lg": "28rem",
        "panel-xl": "32rem",
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
