/** @type {import('tailwindcss').Config} */
module.exports = {
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
      // -----------------------------------------------------------------------
      // COLORS
      //
      // Every value is a CSS variable defined in globals.css.
      // The active theme class on <html> resolves variables automatically.
      // Components never need dark: or high-contrast: variants for these tokens.
      //
      // Semantic color naming:
      //   <name>-subtle  = low-emphasis tint (badge bg, gradient fill)
      //   <name>         = canonical color   (icon, ring, active state)
      //   <name>-strong  = high-emphasis     (border, text on surface)
      // -----------------------------------------------------------------------
      colors: {
        // Surface — use the structural class (surface-base / surface-subtle /
        // surface-raised) in components instead of bg-surface-*.
        // bg-surface-* utilities are kept for rare cases where you need a
        // background without establishing a new surface context (e.g. a
        // decorative swatch or a non-interactive background overlay).
        surface: {
          base: "var(--color-surface-base)",
          subtle: "var(--color-surface-subtle)",
          raised: "var(--color-surface-raised)",
        },

        // Divide — borders and dividers only, never as background
        divide: "var(--color-divide)",

        // Text — pick by role, not by shade
        text: {
          muted: "var(--color-text-muted)",
          secondary: "var(--color-text-secondary)",
          body: "var(--color-text-body)",
          emphasis: "var(--color-text-emphasis)",
          heading: "var(--color-text-heading)",
        },

        // Primary — brand blue (scale shifts per theme)
        // ghost   = faintest tint  (hover backgrounds, subtle fills)
        // faint   = very low emphasis (disabled states, decorative)
        // muted   = low emphasis
        // subtle  = below-default emphasis
        // soft    = slightly below default
        // DEFAULT = canonical active color (icon, ring, active state)
        // strong  = high emphasis (borders, text on light surface)
        // bold    = stronger emphasis
        // deep    = near-darkest
        // darker  = very dark
        // ink     = darkest, near-black
        primary: {
          ghost: "var(--color-primary-ghost)",
          faint: "var(--color-primary-faint)",
          muted: "var(--color-primary-muted)",
          subtle: "var(--color-primary-subtle)",
          soft: "var(--color-primary-soft)",
          DEFAULT: "var(--color-primary)",
          strong: "var(--color-primary-strong)",
          bold: "var(--color-primary-bold)",
          deep: "var(--color-primary-deep)",
          darker: "var(--color-primary-darker)",
          ink: "var(--color-primary-ink)",
        },

        // Secondary — brand green (scale shifts per theme)
        // ghost   = faintest tint  (hover backgrounds, subtle fills)
        // faint   = very low emphasis (disabled states, decorative)
        // muted   = low emphasis
        // subtle  = below-default emphasis
        // soft    = slightly below default
        // DEFAULT = canonical active color (icon, ring, active state)
        // strong  = high emphasis (borders, text on light surface)
        // bold    = stronger emphasis
        // deep    = near-darkest
        // darker  = very dark
        // ink     = darkest, near-black
        secondary: {
          ghost: "var(--color-secondary-ghost)",
          faint: "var(--color-secondary-faint)",
          muted: "var(--color-secondary-muted)",
          subtle: "var(--color-secondary-subtle)",
          soft: "var(--color-secondary-soft)",
          DEFAULT: "var(--color-secondary)",
          strong: "var(--color-secondary-strong)",
          bold: "var(--color-secondary-bold)",
          deep: "var(--color-secondary-deep)",
          darker: "var(--color-secondary-darker)",
          ink: "var(--color-secondary-ink)",
        },

        // Status — subtle/strong flip per theme; DEFAULT stays vivid
        success: {
          subtle: "var(--color-success-subtle)",
          DEFAULT: "var(--color-success)",
          strong: "var(--color-success-strong)",
        },
        error: {
          subtle: "var(--color-error-subtle)",
          DEFAULT: "var(--color-error)",
          strong: "var(--color-error-strong)",
        },
        warning: {
          subtle: "var(--color-warning-subtle)",
          DEFAULT: "var(--color-warning)",
          strong: "var(--color-warning-strong)",
        },
        info: {
          subtle: "var(--color-info-subtle)",
          DEFAULT: "var(--color-info)",
          strong: "var(--color-info-strong)",
        },

        // Team (gender) — subtle/strong flip per theme
        team: {
          male: {
            subtle: "var(--color-team-male-subtle)",
            DEFAULT: "var(--color-team-male)",
            strong: "var(--color-team-male-strong)",
          },
          female: {
            subtle: "var(--color-team-female-subtle)",
            DEFAULT: "var(--color-team-female)",
            strong: "var(--color-team-female-strong)",
          },
        },

        // Competition levels — subtle/strong flip per theme
        national: {
          subtle: "var(--color-national-subtle)",
          DEFAULT: "var(--color-national)",
          strong: "var(--color-national-strong)",
        },
        regional: {
          subtle: "var(--color-regional-subtle)",
          DEFAULT: "var(--color-regional)",
          strong: "var(--color-regional-strong)",
        },
        departmental: {
          subtle: "var(--color-departmental-subtle)",
          DEFAULT: "var(--color-departmental)",
          strong: "var(--color-departmental-strong)",
        },
        clubs: {
          subtle: "var(--color-clubs-subtle)",
          DEFAULT: "var(--color-clubs)",
          strong: "var(--color-clubs-strong)",
        },

        category: {
          subtle: "var(--color-category-subtle)",
          DEFAULT: "var(--color-category)",
          strong: "var(--color-category-strong)",
        },
        division: {
          subtle: "var(--color-division-subtle)",
          DEFAULT: "var(--color-division)",
          strong: "var(--color-division-strong)",
        },
        pool: {
          subtle: "var(--color-pool-subtle)",
          DEFAULT: "var(--color-pool)",
          strong: "var(--color-pool-strong)",
        },

        // Domain entities — subtle/strong flip per theme
        players: {
          subtle: "var(--color-players-subtle)",
          DEFAULT: "var(--color-players)",
          strong: "var(--color-players-strong)",
        },
        teams: {
          subtle: "var(--color-teams-subtle)",
          DEFAULT: "var(--color-teams)",
          strong: "var(--color-teams-strong)",
        },
        matches: {
          subtle: "var(--color-matches-subtle)",
          DEFAULT: "var(--color-matches)",
          strong: "var(--color-matches-strong)",
        },

        position: {
          g: {
            subtle: "var(--color-position-g-subtle)",
            DEFAULT: "var(--color-position-g)",
            strong: "var(--color-position-g-strong)",
          },
          f: {
            subtle: "var(--color-position-f-subtle)",
            DEFAULT: "var(--color-position-f)",
            strong: "var(--color-position-f-strong)",
          },
          c: {
            subtle: "var(--color-position-c-subtle)",
            DEFAULT: "var(--color-position-c)",
            strong: "var(--color-position-c-strong)",
          },
        },
      },

      // -----------------------------------------------------------------------
      // TYPOGRAPHY
      // -----------------------------------------------------------------------
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

      // -----------------------------------------------------------------------
      // SPACING
      // -----------------------------------------------------------------------
      spacing: {
        sidebar: "22rem",
        panel: "25rem",
        "panel-lg": "28rem",
        "panel-xl": "32rem",
      },

      // -----------------------------------------------------------------------
      // BORDER RADIUS
      // -----------------------------------------------------------------------
      borderRadius: {
        card: "0.75rem", // 12px — cards
        button: "0.5rem", //  8px — buttons
        input: "0.375rem", //  6px — inputs
      },

      // -----------------------------------------------------------------------
      // SHADOWS
      // Variables flip per theme — use these classes with no dark: prefix.
      // -----------------------------------------------------------------------
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },

      // -----------------------------------------------------------------------
      // HEADER BACKDROP
      // -----------------------------------------------------------------------
      backgroundColor: {
        header: "var(--color-header-bg)",
      },

      // -----------------------------------------------------------------------
      // ANIMATIONS
      // -----------------------------------------------------------------------
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
    },
  },

  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        // ── Scrollbar utilities ──────────────────────────────────────────────
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "&::-webkit-scrollbar": { width: "8px", height: "8px" },
        },

        // ── Surface context consumers ────────────────────────────────────────
        //
        // These utilities read from CSS variables set by the nearest
        // .surface-base / .surface-subtle / .surface-raised ancestor.
        // Components that use them are automatically correct regardless of
        // where in the elevation hierarchy they are placed.
        //
        // .bg-surface-inset      — background one step above the current surface
        //                          use for: inputs, infoboxes, skeleton fills,
        //                          modals, hover states
        //
        // .bg-surface-own        — this element's own background value
        //                          use for: scrollable containers that need to
        //                          read their own bg (e.g. sticky headers)
        //
        // .ring-offset-surface   — focus ring offset matching the current surface
        //                          always pair with focus:ring-2 focus:ring-*
        //
        // .hover\:bg-surface-inset — convenience hover variant
        //                          use instead of hover:bg-surface-raised on
        //                          interactive elements inside any surface
        // --------------------------------------------------------------------
        ".bg-surface-inset": {
          "background-color": "var(--surface-inset)",
        },
        ".bg-surface-own": {
          "background-color": "var(--surface-bg)",
        },
        ".ring-offset-surface": {
          "--tw-ring-offset-color": "var(--surface-ring-offset)",
        },
        ".hover\\:bg-surface-inset:hover": {
          "background-color": "var(--surface-inset)",
        },

        // ── Horizontal scroll affordance ─────────────────────────────────────
        //
        // Edge shadows on a horizontally scrollable region, appearing only
        // while there is content past that edge.
        //
        // Pure CSS on purpose: DataTable renders inside server components, so
        // a JS overflow observer would push a "use client" boundary onto every
        // table in the app just to draw two gradients.
        //
        // Four layers, and the trick is background-attachment. The two `local`
        // covers are painted in the container's own background colour and
        // scroll *with* the content, so at either extreme the cover sits on
        // top of that side's shadow and hides it. The two `scroll` shadows
        // stay pinned to the container. Scroll away from an edge and its cover
        // travels off, revealing the shadow.
        //
        // Reads --surface-bg from the nearest .surface-* ancestor, so it is
        // correct at any elevation, and --color-scroll-shadow, which flips per
        // theme — a black shadow is invisible on high-contrast's pure black.
        ".scroll-shadow-x": {
          "background-image": [
            "linear-gradient(to right, var(--surface-bg), transparent)",
            "linear-gradient(to left, var(--surface-bg), transparent)",
            "linear-gradient(to right, var(--color-scroll-shadow), transparent)",
            "linear-gradient(to left, var(--color-scroll-shadow), transparent)",
          ].join(", "),
          "background-position": "0 0, 100% 0, 0 0, 100% 0",
          "background-repeat": "no-repeat",
          "background-size": "28px 100%, 28px 100%, 14px 100%, 14px 100%",
          "background-attachment": "local, local, scroll, scroll",
        },

        // ── Ghost number stroke — no Tailwind utility exists for -webkit-text-stroke;
        // color: transparent is co-located here to avoid class-order conflicts
        ".text-stroke-primary": {
          color: "transparent",
          "-webkit-text-stroke": "2px var(--color-primary-soft)",
        },
        ".text-stroke-secondary": {
          color: "transparent",
          "-webkit-text-stroke": "2px var(--color-secondary-soft)",
        },
      });
    },
  ],
};
