// src/frontend/shared/components/primitives/List.tsx
import type { ReactNode } from "react";

/** A list of `ListItem` rows, ruled between them. */
export function List({ children }: Readonly<{ children: ReactNode }>) {
  return <ul className="divide-y divide-divide">{children}</ul>;
}

export default List;
