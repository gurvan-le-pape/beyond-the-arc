// src/frontend/features/site/home/components/HeroSearch.tsx
import { SearchField } from "@/shared/components/forms";
import { Button } from "@/shared/components/primitives";

interface HeroSearchProps {
  /** The locale-prefixed search page path, e.g. `/en/search`. */
  readonly action: string;
  readonly label: string;
  readonly placeholder: string;
  readonly submit: string;
  /** The clear button's accessible name. */
  readonly clearLabel: string;
}

/**
 * The home page's player search: a plain GET form onto the search page's
 * players tab, which reads its query from `?q=`.
 *
 * A native form rather than client state, so it works before hydration and
 * stays a server component; the search page owns everything after submit.
 */
export function HeroSearch({
  action,
  label,
  placeholder,
  submit,
  clearLabel,
}: HeroSearchProps) {
  return (
    <form
      role="search"
      action={action}
      method="get"
      className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
    >
      <input type="hidden" name="tab" value="players" />
      <div className="flex-1">
        <SearchField
          name="q"
          required
          aria-label={label}
          placeholder={placeholder}
          size="lg"
          labels={{ clear: clearLabel }}
        />
      </div>
      <Button type="submit" size="lg">
        {submit}
      </Button>
    </form>
  );
}
