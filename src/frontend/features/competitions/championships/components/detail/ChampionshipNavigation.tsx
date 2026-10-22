// src/frontend/features/competitions/championships/components/detail/ChampionshipNavigation.tsx
import { useTranslations } from "next-intl";

import type { ChampionshipNavLink } from "@/features/competitions/championships/types";
import { Link } from "@/navigation";
import { Card, navButtonVariants } from "@/shared/components/primitives";

interface ChampionshipNavigationProps {
  readonly categoryLinks: ChampionshipNavLink[];
  readonly divisionLinks: ChampionshipNavLink[];
}

/**
 * Sideways navigation between sibling championships: same competition, other
 * category, or same category, other division.
 *
 * Every entry is a real page, so every entry is a real link — which is what
 * keeps this a server component. Rendering them as buttons and calling the
 * router would mean shipping the whole panel to the client, and losing
 * prefetch, middle-click and the back button with it.
 */
export function ChampionshipNavigation({
  categoryLinks,
  divisionLinks,
}: ChampionshipNavigationProps) {
  const tCompetitions = useTranslations("competitions");

  if (categoryLinks.length === 0 && divisionLinks.length === 0) return null;

  return (
    <Card padding="md">
      <div className="space-y-4">
        <NavLinkRow
          links={categoryLinks}
          ariaLabel={tCompetitions("categoryAriaLabel")}
        />
        <NavLinkRow
          links={divisionLinks}
          ariaLabel={tCompetitions("divisionAriaLabel")}
        />
      </div>
    </Card>
  );
}

interface NavLinkRowProps {
  readonly links: ChampionshipNavLink[];
  readonly ariaLabel: string;
}

function NavLinkRow({ links, ariaLabel }: NavLinkRowProps) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.isCurrent ? "page" : undefined}
          className={navButtonVariants({
            variant: link.isCurrent ? "navActive" : "navInactive",
          })}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
