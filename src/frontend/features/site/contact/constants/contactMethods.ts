// src/frontend/features/site/contact/constants/contactMethods.ts
import { Gitlab, Linkedin, Mail } from "lucide-react";

import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  GITLAB_PROFILE_URL,
  LINKEDIN_URL,
} from "@/shared/constants";

/**
 * The displayed value drops the scheme; the href keeps it.
 *
 * @param url - an absolute URL
 * @returns the URL without its scheme, for display where the protocol is noise
 */
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
  },
  {
    icon: Gitlab,
    labelKey: "contact.gitlab",
    value: stripScheme(GITLAB_PROFILE_URL),
    href: GITLAB_PROFILE_URL,
  },
  {
    icon: Linkedin,
    labelKey: "contact.linkedin",
    value: stripScheme(LINKEDIN_URL),
    href: LINKEDIN_URL,
  },
] as const;
