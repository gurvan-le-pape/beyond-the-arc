// src/frontend/shared/components/layout/footer/Footer.tsx
"use client";

import { ExternalLink, Gitlab, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import {
  CONTACT_MAILTO,
  GITLAB_PROFILE_URL,
  GITLAB_REPO_URL,
  LINKEDIN_URL,
} from "@/shared/constants";

import { Text } from "../../typography";

/**
 * The site footer: brand blurb, social links, two link groups, and a closing
 * line — copyright on one side, where the data comes from on the other.
 *
 * **`"use client"` is here for the copyright year.** `new Date()` in a server
 * component is evaluated when the page renders — which, for a statically
 * rendered route, is at build time, freezing the year into the output. Reading
 * it on the client keeps it correct without making every page dynamic.
 *
 * Destinations come from the shared link constants, and external ones open in a
 * new tab with `noopener noreferrer`. Adding a link is a change to the group
 * arrays here plus a catalogue key.
 */
export function Footer() {
  const t = useTranslations("navigation");
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    project: [
      { href: "/about", label: t("footer.about") },
      { href: "/product", label: t("footer.product") },
      { href: "/architecture", label: t("footer.architecture") },
      { href: "/docs", label: t("footer.documentation") },
    ],
    resources: [
      {
        href: GITLAB_REPO_URL,
        label: t("footer.sourceCode"),
        external: true,
      },
      {
        href: "https://www.ffbb.com/",
        label: t("footer.officialSite"),
        external: true,
      },
    ],
  };

  // Shared classes for social/icon link buttons — not a Button variant because
  // these are <a> elements and the icon scaling group effect is specific here.
  const iconLinkClass =
    "p-2 rounded-button hover:bg-surface-inset " +
    "text-text-body hover:text-ink-primary " +
    "transition-all duration-200 group focus-ring";

  const navLinkClass =
    "text-text-body hover:text-ink-primary transition-colors duration-200";

  return (
    <footer className="surface-base border-t border-divide mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 mb-6">
          <div className="space-y-2 max-w-sm">
            <div>
              {/* Styled as a heading, but not one: the footer is not a section
                  of the page's outline, and an h3 here followed every page's
                  h1 with no h2 between. */}
              <Text variant="h3" as="p" className="mb-2">
                {t("footer.projectName")}
              </Text>
              <Text variant="body" as="p" className="leading-relaxed">
                {t("footer.tagline")}
              </Text>
            </div>

            {/* Pulled left by the icon buttons' padding, so the icons line up
                with the text above. */}
            <div className="flex gap-2 -ml-2">
              <a
                href={GITLAB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={t("footer.gitlab")}
                title={t("footer.gitlab")}
              >
                <Gitlab className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={t("footer.linkedin")}
                title={t("footer.linkedin")}
              >
                <Linkedin className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
              <a
                href={CONTACT_MAILTO}
                className={iconLinkClass}
                aria-label={t("footer.email")}
                title={t("footer.email")}
              >
                <Mail className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* The link groups are one navigation region: side by side from a
              phone up, so the footer does not stack into a long column. */}
          <nav
            aria-label={t("footer.navigationAriaLabel")}
            className="grid grid-cols-2 gap-8 sm:flex sm:gap-24 lg:gap-40"
          >
            <div>
              <Text variant="overline" className="mb-4 block">
                {t("footer.project")}
              </Text>
              <ul className="space-y-2">
                {footerLinks.project.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm inline-flex items-center min-h-6 ${navLinkClass}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Text variant="overline" className="mb-4 block">
                {t("footer.resources")}
              </Text>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm inline-flex items-center min-h-6 gap-1 group ${navLinkClass}`}
                      >
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm inline-flex items-center min-h-6 ${navLinkClass}`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="pt-4 border-t border-divide flex flex-col sm:flex-row sm:justify-between gap-x-8 gap-y-1">
          <Text variant="caption" as="p">
            {t("footer.copyright", {
              year: currentYear,
              name: "Gurvan LE PAPE",
            })}
            <span aria-hidden="true"> · </span>
            {t("footer.nonCommercial")}
          </Text>
          <Text variant="caption" as="p">
            {t("footer.dataDisclaimer")}
          </Text>
        </div>
      </div>
    </footer>
  );
}
