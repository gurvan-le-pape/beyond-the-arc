// src/frontend/shared/components/layout/header/HamburgerButton.tsx

interface HamburgerButtonProps {
  readonly open: boolean;
}

/**
 * The three-bar menu glyph, animating into a cross when `open`.
 *
 * **This is a `<span>`, not a button**, despite the name. It draws the icon and
 * nothing else — the caller supplies the real `<button>`, its click handler,
 * `aria-expanded`, `aria-controls` and accessible name. Rendering it alone
 * produces a control no keyboard or screen reader can reach.
 */
export function HamburgerButton({ open }: HamburgerButtonProps) {
  return (
    <span className="relative w-6 h-6 block">
      <span
        className={`absolute left-0 top-1 w-6 h-0.5 bg-text-emphasis rounded transition-all duration-300 ${
          open ? "rotate-45 top-3" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-3 w-6 h-0.5 bg-text-emphasis rounded transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-5 w-6 h-0.5 bg-text-emphasis rounded transition-all duration-300 ${
          open ? "-rotate-45 top-3" : ""
        }`}
      />
    </span>
  );
}

export default HamburgerButton;
