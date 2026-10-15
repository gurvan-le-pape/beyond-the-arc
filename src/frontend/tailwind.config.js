const tones = Object.keys(require("./styles/tones.json"));

/** A colour role from styles/roles.css, with Tailwind's opacity modifier. */
const role = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** One entry per tone of styles/tones.json, built from its name. */
const byTone = (build) =>
  Object.fromEntries(tones.map((tone) => [tone, build(tone)]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
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
          base: "rgb(var(--color-surface-base) / <alpha-value>)",
          subtle: "rgb(var(--color-surface-subtle) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
        },

        // Divide — borders and dividers only, never as background
        divide: "rgb(var(--color-divide) / <alpha-value>)",

        // Text — pick by role, not by shade
        text: {
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          body: "rgb(var(--color-text-body) / <alpha-value>)",
          emphasis: "rgb(var(--color-text-emphasis) / <alpha-value>)",
          heading: "rgb(var(--color-text-heading) / <alpha-value>)",
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
          ghost: "rgb(var(--color-primary-ghost) / <alpha-value>)",
          faint: "rgb(var(--color-primary-faint) / <alpha-value>)",
          muted: "rgb(var(--color-primary-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-primary-subtle) / <alpha-value>)",
          soft: "rgb(var(--color-primary-soft) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          strong: "rgb(var(--color-primary-strong) / <alpha-value>)",
          bold: "rgb(var(--color-primary-bold) / <alpha-value>)",
          deep: "rgb(var(--color-primary-deep) / <alpha-value>)",
          darker: "rgb(var(--color-primary-darker) / <alpha-value>)",
          ink: "rgb(var(--color-primary-ink) / <alpha-value>)",
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
          ghost: "rgb(var(--color-secondary-ghost) / <alpha-value>)",
          faint: "rgb(var(--color-secondary-faint) / <alpha-value>)",
          muted: "rgb(var(--color-secondary-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-secondary-subtle) / <alpha-value>)",
          soft: "rgb(var(--color-secondary-soft) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          strong: "rgb(var(--color-secondary-strong) / <alpha-value>)",
          bold: "rgb(var(--color-secondary-bold) / <alpha-value>)",
          deep: "rgb(var(--color-secondary-deep) / <alpha-value>)",
          darker: "rgb(var(--color-secondary-darker) / <alpha-value>)",
          ink: "rgb(var(--color-secondary-ink) / <alpha-value>)",
        },

        // Status — subtle/strong flip per theme; DEFAULT stays vivid
        success: {
          subtle: "rgb(var(--color-success-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          strong: "rgb(var(--color-success-strong) / <alpha-value>)",
        },
        error: {
          subtle: "rgb(var(--color-error-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          strong: "rgb(var(--color-error-strong) / <alpha-value>)",
        },
        warning: {
          subtle: "rgb(var(--color-warning-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
          strong: "rgb(var(--color-warning-strong) / <alpha-value>)",
        },
        info: {
          subtle: "rgb(var(--color-info-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
          strong: "rgb(var(--color-info-strong) / <alpha-value>)",
        },

        // Team (gender) — subtle/strong flip per theme
        team: {
          male: {
            subtle: "rgb(var(--color-team-male-subtle) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-team-male) / <alpha-value>)",
            strong: "rgb(var(--color-team-male-strong) / <alpha-value>)",
          },
          female: {
            subtle: "rgb(var(--color-team-female-subtle) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-team-female) / <alpha-value>)",
            strong: "rgb(var(--color-team-female-strong) / <alpha-value>)",
          },
        },

        // Competition levels — subtle/strong flip per theme
        national: {
          subtle: "rgb(var(--color-national-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-national) / <alpha-value>)",
          strong: "rgb(var(--color-national-strong) / <alpha-value>)",
        },
        regional: {
          subtle: "rgb(var(--color-regional-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-regional) / <alpha-value>)",
          strong: "rgb(var(--color-regional-strong) / <alpha-value>)",
        },
        departmental: {
          subtle: "rgb(var(--color-departmental-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-departmental) / <alpha-value>)",
          strong: "rgb(var(--color-departmental-strong) / <alpha-value>)",
        },
        clubs: {
          subtle: "rgb(var(--color-clubs-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-clubs) / <alpha-value>)",
          strong: "rgb(var(--color-clubs-strong) / <alpha-value>)",
        },

        // Match-event categories. One colour per EventCategory, and no
        // subtle/DEFAULT/strong triad: these are only ever label text, so the
        // single step each theme defines is already the readable one.
        event: {
          made: "rgb(var(--color-event-made) / <alpha-value>)",
          miss: "rgb(var(--color-event-miss) / <alpha-value>)",
          foul: "rgb(var(--color-event-foul) / <alpha-value>)",
          turnover: "rgb(var(--color-event-turnover) / <alpha-value>)",
          defensive: "rgb(var(--color-event-defensive) / <alpha-value>)",
          rebound: "rgb(var(--color-event-rebound) / <alpha-value>)",
          substitution: "rgb(var(--color-event-substitution) / <alpha-value>)",
          game: "rgb(var(--color-event-game) / <alpha-value>)",
        },

        category: {
          subtle: "rgb(var(--color-category-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-category) / <alpha-value>)",
          strong: "rgb(var(--color-category-strong) / <alpha-value>)",
        },
        division: {
          subtle: "rgb(var(--color-division-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-division) / <alpha-value>)",
          strong: "rgb(var(--color-division-strong) / <alpha-value>)",
        },
        pool: {
          subtle: "rgb(var(--color-pool-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-pool) / <alpha-value>)",
          strong: "rgb(var(--color-pool-strong) / <alpha-value>)",
        },

        // Domain entities — subtle/strong flip per theme
        players: {
          subtle: "rgb(var(--color-players-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-players) / <alpha-value>)",
          strong: "rgb(var(--color-players-strong) / <alpha-value>)",
        },
        teams: {
          subtle: "rgb(var(--color-teams-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-teams) / <alpha-value>)",
          strong: "rgb(var(--color-teams-strong) / <alpha-value>)",
        },
        matches: {
          subtle: "rgb(var(--color-matches-subtle) / <alpha-value>)",
          DEFAULT: "rgb(var(--color-matches) / <alpha-value>)",
          strong: "rgb(var(--color-matches-strong) / <alpha-value>)",
        },

        position: {
          g: {
            subtle: "rgb(var(--color-position-g-subtle) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-position-g) / <alpha-value>)",
            strong: "rgb(var(--color-position-g-strong) / <alpha-value>)",
          },
          f: {
            subtle: "rgb(var(--color-position-f-subtle) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-position-f) / <alpha-value>)",
            strong: "rgb(var(--color-position-f-strong) / <alpha-value>)",
          },
          c: {
            subtle: "rgb(var(--color-position-c-subtle) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-position-c) / <alpha-value>)",
            strong: "rgb(var(--color-position-c-strong) / <alpha-value>)",
          },
        },

        // Shot-chart court: floor, markings, zone figures
        court: {
          floor: "rgb(var(--color-court-floor) / <alpha-value>)",
          line: "rgb(var(--color-court-line) / <alpha-value>)",
          label: "rgb(var(--color-court-label) / <alpha-value>)",
        },

        // Colour roles, one set per tone of styles/tones.json, solved from
        // the Radix scales by scripts/generate-palette.mts so that each pair
        // clears 4.5:1 in every theme. Use them as pairs:
        //   bg-solid-<tone> hover:bg-solid-<tone>-hover text-on-solid-<tone>
        //   bg-tint-<tone> hover:bg-tint-<tone>-hover text-ink-<tone>
        //   text-ink-<tone> on any surface, border-line-<tone> for a border
        solid: byTone((tone) => ({
          DEFAULT: role(`solid-${tone}`),
          hover: role(`solid-${tone}-hover`),
        })),
        "on-solid": byTone((tone) => role(`on-solid-${tone}`)),
        tint: byTone((tone) => ({
          DEFAULT: role(`tint-${tone}`),
          hover: role(`tint-${tone}-hover`),
        })),
        ink: byTone((tone) => role(`ink-${tone}`)),
        line: byTone((tone) => role(`line-${tone}`)),
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

        // ── Focus indicator ──────────────────────────────────────────────────
        //
        // The keyboard focus style. globals.css already gives every element
        // this indicator by default; .focus-ring names it explicitly on
        // interactive primitives. An outline rather than a ring: a
        // box-shadow ring disappears in forced-colors mode (Windows high
        // contrast) and fights an element's own shadow, an outline does
        // neither. :focus-visible, so a mouse click does not draw it.
        // primary-strong, not primary: a focus indicator needs 3:1 against the
        // surface, and primary is 2.84:1 on the dark surfaces.
        //
        // .focus-ring-inset draws inside the box, for elements whose container
        // clips overflow (table cells, tab strips, list rows).
        //
        // On a coloured panel, where primary-strong does not stand out, set
        // --focus-ring-color on the panel ([--focus-ring-color:white]).
        ".focus-ring": {
          "&:focus-visible": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-primary-strong)))",
            "outline-offset": "2px",
          },
        },
        ".focus-ring-inset": {
          "&:focus-visible": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-primary-strong)))",
            "outline-offset": "-2px",
          },
        },
        // .focus-ring-overlay draws on the element's ::after, for a link whose
        // ::after is stretched over a larger box (the table row link).
        ".focus-ring-overlay": {
          "&:focus-visible": { outline: "none" },
          "&:focus-visible::after": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-primary-strong)))",
            "outline-offset": "-2px",
          },
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
        // These are `background-color` utilities and nothing else. There is no
        // `from-surface-inset` or `to-surface-own`, because a gradient stop is
        // a different Tailwind mechanism — `--tw-gradient-from` and the stops
        // chain, not `background-color`. Four components wrote those names and
        // got no gradient at all: neither class exists, `--tw-gradient-stops`
        // stayed unset, and the whole `background-image` was invalid. For a
        // gradient over the surface context, read the variables directly:
        // `from-[var(--surface-inset)] to-[var(--surface-bg)]`.
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
          "-webkit-text-stroke": "2px rgb(var(--color-primary-soft))",
        },
        ".text-stroke-secondary": {
          color: "transparent",
          "-webkit-text-stroke": "2px rgb(var(--color-secondary-soft))",
        },
      });
    },
  ],
};
