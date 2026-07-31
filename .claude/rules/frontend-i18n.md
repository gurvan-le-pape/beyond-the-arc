---
description: next-intl 4 — everything user-facing goes through a message catalogue.
paths:
  - "src/frontend/messages/**"
  - "src/frontend/scripts/**"
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
---

# Frontend — internationalisation

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend`. **Locked:** `next-intl@4.12.0`. There is also a `check:messages` script: `node scripts/check-message-parity.mts`. `[manifest]`

Two locales ship: **`en`** and **`fr`**, as sibling directories under `src/frontend/messages/`, each holding namespaced catalogue files (`common.json` and friends). Both are first-class — neither is "the translation of" the other, and both are updated in the same change. `npm run check:messages` enforces identical key sets across them. `[project]`

## Everything user-facing goes through next-intl

- **No hard-coded user-facing strings in components.** Every visible string comes from a message catalogue, including `aria-label`, `title`, `alt`, placeholder text, and error copy. Accessibility attributes are user-facing text and are the ones most often missed. `[principle]`
- If you add a string, add the key to **every** locale catalogue in the same change — that is what `check:messages` exists to enforce. Run `npm run check:messages` before opening a PR. `[manifest]`+`[principle]`
- Never build a sentence by concatenating translated fragments. Word order differs between languages. Use one message with interpolation, and ICU plural/select syntax for counts and gendered forms. `[principle]`

## v4 wiring

The pieces, and which file each belongs in: `[upstream]`

- **`routing.ts`** — `defineRouting({ locales, defaultLocale })`. Single source of truth for the locale set. `[upstream]`
- **Middleware** — `createMiddleware(routing)`, handling prefix-based (`/en/about`) or domain-based routing. *(Upstream notes this file is named `proxy.ts` from Next.js 16 onward; on `next@15.5.18` it is `middleware.ts`.)* `[upstream]`+`[manifest]`
- **`i18n/request.ts`** — `getRequestConfig`, which receives `requestLocale`, validates it with `hasLocale()` against the configured locales, and falls back to `defaultLocale`. `[upstream]`
- **`createNavigation`** — locale-aware wrappers for `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. Import navigation from here, **never** from `next/link` or `next/navigation` directly, or you will drop the locale prefix. `[upstream]`+`[principle]`
- **`NextIntlClientProvider`** — wraps the subtree that needs client-side translations. `[upstream]`

- Always validate the incoming `locale` param against the configured list before using it. An unvalidated segment lets any string reach the message loader. `[upstream]`+`[principle]`

## Static rendering: `setRequestLocale`

- Reading the locale from headers forces the route to render dynamically. `setRequestLocale` puts the locale into a `cache()`-backed store so Server Components can read it without touching headers, which is what keeps pages statically renderable. `[upstream]`
- It must be called **before any other next-intl function** in that render. `[upstream]`
- Pair it with `generateStaticParams` returning every locale you want built ahead of time. `[upstream]`

```tsx
// app/[locale]/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return props.children;
}
```

Note the `await` on `params` — Next.js 15 made it a Promise. See `frontend-nextjs.md`. `[upstream]`

## Which API to use where

- **Server Components and metadata:** `await getTranslations({ locale, namespace })`. `[upstream]`
- **Client Components:** `useTranslations(namespace)`. `[upstream]`
- Do not reach for the client hook in a Server Component to avoid an `await`; it will force a client boundary you did not intend. `[upstream]`+`[principle]`

## Catalogue hygiene

- Namespace keys by feature, and keep the key naming stable — a rename is a change every translator has to redo. `[principle]`
- Key names describe *where and what*, not the English text: `widgets.list.emptyState`, not `noWidgetsFound`. English copy changes; the key should not have to. `[principle]`
- Delete keys when the code using them is deleted. Orphaned messages accumulate silently because nothing type-checks them. `[principle]`
- Locale-sensitive formatting (numbers, dates, currency, lists) goes through next-intl's formatters or `Intl`, never through hand-written string building. For time zones specifically, see `dates-and-timezones.md`. `[principle]`

## `scripts/check-message-parity.mts`

- It is a `.mts` file run directly by `node`, with no build step, so it is subject to Node's native type-stripping limits: no enums, no runtime namespaces, no parameter properties, no decorators, mandatory `import type`, mandatory file extensions in import specifiers, and **no `tsconfig.json` is consulted** — path aliases will not resolve there. See `typescript.md`. `[upstream]`+`[manifest]`
- The frontend's `lint` glob covers `.mts`, but its `lint:fix` glob does not pass `.mts` to `organize-imports-cli`. Expect to fix import order in that file by hand. `[manifest]`
