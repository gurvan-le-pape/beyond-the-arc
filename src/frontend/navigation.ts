// src/frontend/navigation.ts
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "always", // or 'as-needed'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
