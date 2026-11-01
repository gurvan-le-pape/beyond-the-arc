// src/frontend/shared/components/primitives/Button.tsx
"use client";

import type { VariantProps } from "class-variance-authority";
import type { ReactNode, Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { cn } from "@/shared/utils";

// Narrow path, not the `../feedback` barrel: that barrel re-exports
// `EmptyState`, which imports this file, so the barrel form closes a runtime
// import cycle (Button → feedback/index → EmptyState → Button) and drags the
// whole feedback + layout graph in behind it. `EmptyState.tsx` already writes
// the narrow form in the other direction.
import { Spinner } from "../feedback/Spinner";
import { buttonVariants } from "./buttonStyles";

export interface ButtonProps
  extends
    Omit<AriaButtonProps, "className" | "style" | "children">,
    VariantProps<typeof buttonVariants> {
  readonly className?: string;
  readonly children: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * Button — universal action primitive, on React Aria's Button: `onPress`
 * fires the same for mouse, touch, keyboard and screen reader, and
 * `isDisabled` disables it. `isPending` swaps the content for a spinner and
 * ignores presses while keeping focus, for an action in flight.
 *
 * Use for any clickable action: form submits, modal triggers, data mutations.
 * Do NOT use for navigation links — use <a> or your router's <Link>, styled
 * with `buttonVariants` when it should look like a button.
 * Do NOT add layout-specific variants here (carousel, pill, nav). For a
 * button whose only content is an icon, use `IconButton`.
 *
 * @example
 * <Button variant="primary" size="lg" onPress={save}>Save</Button>
 * <Button variant="outline" isPending={isRetrying} onPress={retry}>Retry</Button>
 * <Button variant="link" size="sm" onPress={reset}>Reset all</Button>
 * <Button type="submit">Search</Button>
 */
export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <AriaButton
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {({ isPending }) => (isPending ? <Spinner size="sm" /> : children)}
    </AriaButton>
  );
}
