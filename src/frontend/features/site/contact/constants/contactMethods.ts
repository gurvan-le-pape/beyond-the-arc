// src/frontend/features/site/contact/constants/contactMethods.ts
import { Github, Linkedin, Mail } from "lucide-react";

import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
} from "@/shared/constants";

/** The displayed value drops the scheme; the href keeps it. */
const stripScheme = (url: string): string => url.replace(/^https?:\/\//, "");

/**
 * The ways to make contact, in display order. Addresses come from
 * `shared/constants` so this file holds no second copy of them; only the
 * label key is resolved by the page.
 */
export const CONTACT_METHODS = [
  {
    icon: Mail,
    labelKey: "contact.email",
    value: CONTACT_EMAIL,
    href: CONTACT_MAILTO,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Github,
    labelKey: "contact.github",
    value: stripScheme(GITHUB_PROFILE_URL),
    href: GITHUB_PROFILE_URL,
    color: "from-gray-700 to-gray-900",
  },
  {
    icon: Linkedin,
    labelKey: "contact.linkedin",
    value: stripScheme(LINKEDIN_URL),
    href: LINKEDIN_URL,
    color: "from-blue-600 to-blue-800",
  },
] as const;
