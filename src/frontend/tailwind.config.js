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
      // Coloured tones are the paired roles at the end of this map; see the
      // COLOUR ROLES section of globals.css.
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
      // STACKING — one named layer per job, so two components never fight with
      // raw numbers. Ordered: an element lifted inside its own component, a
      // menu anchored to a control, the sticky header, a drawer's backdrop and
      // the drawer, a modal dialog, the skip link above everything.
      // -----------------------------------------------------------------------
      zIndex: {
        raised: "10",
        dropdown: "20",
        header: "30",
        backdrop: "40",
        drawer: "45",
        modal: "50",
        skip: "60",
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
        // ink-primary: a focus indicator needs 3:1 against the surface, and the
        // ink role clears 4.5:1 on every surface in every theme.
        //
        // .focus-ring-inset draws inside the box, for elements whose container
        // clips overflow (table cells, tab strips, list rows).
        //
        // On a coloured panel, where ink-primary does not stand out, set
        // --focus-ring-color on the panel ([--focus-ring-color:white]).
        ".focus-ring": {
          "&:focus-visible": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-ink-primary)))",
            "outline-offset": "2px",
          },
        },
        ".focus-ring-inset": {
          "&:focus-visible": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-ink-primary)))",
            "outline-offset": "-2px",
          },
        },
        // .focus-ring-overlay draws on the element's ::after, for a link whose
        // ::after is stretched over a larger box (the table row link).
        ".focus-ring-overlay": {
          "&:focus-visible": { outline: "none" },
          "&:focus-visible::after": {
            outline:
              "2px solid var(--focus-ring-color, rgb(var(--color-ink-primary)))",
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
        // travels off, revealing the shadow. Each cover is solid across its
        // first 14px, the shadow's whole width, and fades only past it: a
        // cover that faded from its edge let part of the shadow through at
        // rest, so every table showed both shadows with nothing to scroll.
        //
        // Reads --surface-bg from the nearest .surface-* ancestor, so it is
        // correct at any elevation, and --color-scroll-shadow, which flips per
        // theme — a black shadow is invisible on high-contrast's pure black.
        ".scroll-shadow-x": {
          "background-image": [
            "linear-gradient(to right, var(--surface-bg) 50%, transparent)",
            "linear-gradient(to left, var(--surface-bg) 50%, transparent)",
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
        ".text-stroke-home": {
          color: "transparent",
          "-webkit-text-stroke": "2px rgb(var(--color-solid-home))",
        },
        ".text-stroke-away": {
          color: "transparent",
          "-webkit-text-stroke": "2px rgb(var(--color-solid-away))",
        },
      });
    },
  ],
};
