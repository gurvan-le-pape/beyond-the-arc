// src/frontend/shared/components/layout/footer/Footer.tsx
"use client";

import { ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import {
  CONTACT_MAILTO,
  GITHUB_PROFILE_URL,
  GITHUB_REPO_URL,
  LINKEDIN_URL,
} from "@/shared/constants";

import { Text } from "../../typography";

/**
 * The site footer: brand blurb, social links, three link groups, and the
 * copyright line.
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
    features: [{ href: "/map", label: t("footer.clubsMap"), icon: MapPin }],
    project: [
      { href: "/about", label: t("footer.about") },
      { href: "/product", label: t("footer.product") },
      { href: "/architecture", label: t("footer.architecture") },
      { href: "/docs", label: t("footer.documentation") },
    ],
    resources: [
      {
        href: GITHUB_REPO_URL,
        label: t("footer.sourceCode"),
        external: true,
      },
      { href: "/contact", label: t("footer.contact") },
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
    "text-text-body hover:text-primary " +
    "transition-all duration-200 group focus:outline-none focus:ring-2 " +
    "focus:ring-primary";

  const navLinkClass =
    "text-text-body hover:text-primary transition-colors duration-200";

  return (
    <footer className="surface-base border-t border-divide mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center text-center lg:items-stretch lg:text-left lg:flex-row lg:justify-between lg:flex-wrap gap-8 mb-4">
          <div className="space-y-2 max-w-sm">
            <div>
              <Text variant="h3" className="mb-2">
                {t("footer.projectName")}
              </Text>
              <Text variant="body" as="p" className="leading-relaxed mb-3">
                {t("footer.tagline")}
              </Text>
              <Text variant="caption" as="p">
                {t("footer.portfolioNote")}
              </Text>
            </div>

            <div className="flex gap-2 pt-1 justify-center lg:justify-start">
              <a
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={iconLinkClass}
                aria-label={t("footer.github")}
                title={t("footer.github")}
              >
                <Github className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
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

          {/* The three link groups are one navigation region. `contents` keeps
              them as direct flex children of the row above, so the landmark is
              added without moving anything. */}
          <nav
            aria-label={t("footer.navigationAriaLabel")}
            className="contents"
          >
            <div>
              <Text variant="overline" className="mb-4 block">
                {t("footer.featuredWork")}
              </Text>
              <ul className="space-y-2">
                {footerLinks.features.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-sm inline-flex items-center gap-2 group ${navLinkClass}`}
                      >
                        <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <Text variant="overline" className="mb-4 block">
                {t("footer.project")}
              </Text>
              <ul className="space-y-2">
                {footerLinks.project.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm inline-block ${navLinkClass}`}
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
                        className={`text-sm inline-flex items-center gap-1 group ${navLinkClass}`}
                      >
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm inline-block ${navLinkClass}`}
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

        <div className="pt-4 border-t border-divide">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
              <Text variant="body" as="p" className="text-center sm:text-left">
                {t("footer.copyright", {
                  year: currentYear,
                  name: "Gurvan LE PAPE",
                })}
              </Text>
              <Text variant="caption" as="p">
                {t("footer.madeWith")}
              </Text>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-1">
              <Text variant="caption" as="span">
                {t("footer.nonCommercial")}
              </Text>
              <Text
                variant="caption"
                as="span"
                className="hidden sm:inline"
                aria-hidden="true"
              >
                •
              </Text>
              <Text variant="caption" as="span">
                {t("footer.dataDisclaimer")}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
