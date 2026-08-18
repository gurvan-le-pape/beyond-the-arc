---
name: document-exports
description: Find exported declarations missing a doc comment (jsdoc/require-jsdoc warnings) and write TSDoc stating each one's contract. Use when asked to document a feature, fill in missing docstrings, or drive the require-jsdoc warning count to zero for a scope. Takes an optional path scope.
---

# Document exported declarations

Turn `jsdoc/require-jsdoc` warnings into doc comments that are worth reading. Every export gets one; the work is finding what each one guarantees.

**Read `docs/frontend-conventions.md#comments` first.** It owns the bar; this skill owns the procedure. Never restate its rules here or in a PR description — cite the section.

## 1. List the gaps

From `src/frontend`, scoped to what the user named (default: ask for a scope rather than taking all 200+):

```bash
npx eslint '<scope-glob>' --format json 2>/dev/null | python3 -c "
import json,sys
for f in json.load(sys.stdin):
    for m in f['messages']:
        if m.get('ruleId')=='jsdoc/require-jsdoc':
            print(f\"{f['filePath'].split('src/frontend/')[1]}:{m['line']}\")
"
```

Work in batches of **at most 10 files**, verifying after each. A 200-file pass produces filler.

## 2. Read the body, then find the contract

**Every export gets a doc comment.** The question is never *whether* — it is what the comment says, and the answer is never the declaration's own name in a sentence.

Open the file and read the **body**, not the signature. The signature is what makes something look self-describing; the body is where the contract lives. Then write what a caller can rely on:

- what it actually accepts, versus what it is usually called with
- what it does at the edges — unknown input, empty input, null, a value outside the enum
- what the caller must not assume, and what it must handle

Lead with a **constraint a caller cannot see** whenever there is one:

- it mutates an argument, or returns the same reference
- a value is coerced or narrowed on the way through (numeric object keys becoming strings)
- two props combine into something else — a path, a query, a key
- the declaration is a client/server boundary, and it is not obvious why
- a prop is also a lookup key, so renaming it breaks something elsewhere
- a sentinel or fallback fires silently rather than erroring
- an index base, a unit, or a hard limit that nothing in the types records

**The failure to avoid is a restating comment, not an unnecessary one.** For a small declaration the difference is entirely in what you looked at:

```ts
/** Maps a player position to a badge variant. */          ← the name, respaced
/** Accepts any string, not the `Position` enum, because
 *  the value arrives unvalidated from the API. The five
 *  positions collapse to three variants — guards share
 *  one, forwards share one — and anything unrecognised
 *  takes the neutral badge rather than throwing. */        ← the contract
```

Both sit above the same fifteen lines. Only one of them was written after reading them.

## 3. Write

- Summary is free text at the top. **Never `@description`/`@desc`** — not TSDoc tags.
- **`@param` and `@returns` are required on every non-component declaration**, with a description on each — `require-param`, `require-returns` and their `-description` variants enforce it for `.ts`/`.mts`. `@param name - description`, hyphen included; document the *role*, not the type.
- `@returns` says what the caller gets **and what it means** — "the matching badge variant, or `default` for anything unrecognised", not "the variant". A return that can be `null`, empty, or a sentinel is the part worth writing.
- **Component props go on the interface members**, not `@param`. `TableColumn<T>` in `shared/components/table/DataTable.tsx` is the pattern — that is what an editor shows when hovering a JSX attribute.
- `@typeParam`, never `@template`.
- No types in tags — `jsdoc/no-types` fails on them.
- State what is true now. No history, no "this used to", no PR numbers.
- Lead with the constraint when there is one. The summary line can be short; the paragraph that earns the comment is the one nobody could have guessed.

## 4. Verify

```bash
npx prettier --write '<scope-glob>' && npm run typecheck && npm run lint
```

`jsdoc/check-param-names`, `check-tag-names` and `no-types` run at **error** — they must stay at zero.

Three warning counts must all reach zero for the scope: `require-jsdoc`, `require-param` and `require-returns`. Check all three, not just the first — a docstring can satisfy `require-jsdoc` and still be missing every tag:

```bash
npx eslint '<scope-glob>' 2>&1 | grep -oE "jsdoc/[a-z-]+" | sort | uniq -c
```

## Never

- **Never run `eslint --fix` for this.** `require-jsdoc`'s fixer inserts empty `/** */` stubs that satisfy the rule and say nothing. Every doc comment is hand-written.
- Never write a summary that repeats the declaration's name.
- Never document a child's internals at the call site — that belongs on the child.
- Never invent an `@example`. Nothing typechecks code inside comments, so an invented one rots silently; point at a real call site instead.

## Report

A table of file:line and, for each, the **contract the docstring states** — in a few words, citing what the body does. A row that could have been written without opening the file is one that was not read. Then the before/after counts for `require-jsdoc`, `require-param` and `require-returns` — all three must reach zero for the scope.
