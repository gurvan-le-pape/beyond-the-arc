// src/frontend/shared/components/primitives/Divide.tsx
/**
 * A hairline rule filling its container's width.
 *
 * Decorative only — it is `aria-hidden` and is not an `<hr>`, so it draws a
 * separation without announcing one. Where the split is *semantic*, the
 * surrounding structure must carry that meaning itself.
 *
 * Takes no props, `className` included: its one job has one appearance.
 */
export function Divide() {
  return <div className="w-full h-px bg-divide" aria-hidden />;
}
