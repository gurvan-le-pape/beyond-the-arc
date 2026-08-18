---
description: Doc comments — TSDoc, not JSDoc; which tags exist, and what does not check them.
paths:
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
  - "src/backend/**/*.ts"
---

# Documentation comments

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Doc comments follow TSDoc**, the specification TypeScript's own language service implements. Most JSDoc material online predates it and uses tags TSDoc does not define — those tags are not errors, they simply do nothing, which is the worst of both outcomes. `[upstream]`

## The summary is free text, never a tag

Upstream is explicit: *"Any content appearing prior to the first block tag is interpreted as the special 'summary' section."* `[upstream]`

```ts
/**
 * Resolves a widget from its route segment.   ← this is the summary
 *
 * @param id - already parsed; the caller owns the 404
 * @returns the widget, or throws if the id is unknown
 */
```

- **Never `@description` or `@desc`.** Neither is a TSDoc tag. They are JSDoc aliases for a layout TSDoc does not use, and writing one leaves the summary section empty while the prose renders as a trailing block. `[upstream]`
- Generated output is not a style reference. `openapi-typescript` emits `@description` for every schema `description` field it encounters, because a generator has no other way to carry it — that is a mechanical mapping, not a convention to copy into hand-written code. `[manifest]`+`[upstream]`

## Tags

TSDoc standardises 24 tags. The ones that arise in a codebase like this: `@param`, `@typeParam`, `@returns`, `@throws`, `@example`, `@remarks`, `@see`, `@defaultValue`, `@deprecated`. `[upstream]`

- **The hyphen is syntax, not decoration**: `@param id - the parsed route segment`. The same applies to `@typeParam`. `[upstream]`
- **`@typeParam`, never `@template`.** `@template` is JSDoc; `@typeParam` is what TSDoc standardised for generic parameters. `[upstream]`
- **Never write a type into a tag** — no `@param {string} id`. TSDoc omits types by design because the compiler already has them, and a type written twice drifts in one place first. `[upstream]`+`[principle]`
- `@remarks` is where detail belongs once the summary runs past a sentence or two. A summary that has grown into three paragraphs is a summary plus unlabelled remarks. `[upstream]`+`[principle]`

## Nothing validates any of this

- Neither application declares `@microsoft/tsdoc` or `eslint-plugin-tsdoc`. There is no TSDoc parser and no lint rule in the pipeline. `[manifest]`
- So a misspelled tag, a `@param` naming an argument that was renamed, a `@returns` on a `void` function, and code inside `@example` that would not compile are all invisible to lint, typecheck and CI alike. `[manifest]`+`[principle]`
- **Treat an `@example` as the least trustworthy line in any file.** It is prose shaped like code: the compiler never sees it, so it survives every refactor that invalidates it. Prefer naming a real call site over inventing a snippet, and when you do write one, write the import path you would actually type. `[principle]`
- The one consumer that is guaranteed is TypeScript's language service, which renders the summary on hover and at completion. Write for a reader who sees the doc comment **and the signature**, and nothing else of the file. `[upstream]`+`[principle]`

## Where the judgement lives

This file governs the *form*. Which declarations deserve a doc comment at all — and when a comment should have been a better name or an extracted component instead — is a project decision recorded in `docs/frontend-conventions.md`. `[principle]`
