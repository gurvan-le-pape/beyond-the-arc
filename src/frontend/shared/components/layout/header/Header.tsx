// src/frontend/shared/components/layout/header/Header.tsx
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { SettingsMenu } from "./SettingsMenu";

/**
 * The sticky site header: a frosted capsule floating just below the top edge,
 * holding the wordmark, the navigation and the settings — or, on a phone, the
 * wordmark and the ☰ that opens the menu sheet.
 *
 * **The header is still 4rem tall.** The capsule is 3rem with 0.5rem above and
 * below it, and content that sticks under the header (`top-16`, the match
 * timeline's period headers; the clubs map side panel) relies on that height.
 * The band around the capsule fades from the page background to transparent,
 * so content scrolling up under the header dissolves instead of showing a
 * hard-cut line of text above the capsule.
 *
 * Rendered by the `(chrome)` layout, so pages never mount it; a page that wants
 * no header belongs in a different route group.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-header h-16 px-2 sm:px-4 lg:px-6 py-2 pointer-events-none bg-gradient-to-b from-surface-base from-25% to-surface-base/0">
      {/* A plain row, not a landmark: NavLinks renders the labelled <nav>;
          the logo and settings around it are not navigation. The band is
          click-through so the transparent strip around the capsule does not
          swallow clicks meant for the page under it. */}
      <div className="pointer-events-auto mx-auto flex h-full max-w-7xl items-center justify-between gap-4 rounded-full border border-divide/70 bg-header pl-4 pr-1.5 shadow-card-hover backdrop-blur-md transition-colors [.high-contrast_&]:shadow-none">
        <Logo />

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center">
          <SettingsMenu />
        </div>

        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
