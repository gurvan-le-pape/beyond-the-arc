// src/frontend/shared/components/feedback/ErrorCard.tsx
import { SearchX, X } from "lucide-react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import { Button, buttonVariants, Card } from "../primitives";
import { Text } from "../typography";

/**
 * Badge and icon per tone. Kept out of the component so the two never drift
 * apart — a red icon on a neutral badge reads as a rendering bug.
 */
const tones = {
  error: { badge: "bg-error-subtle", icon: "text-error", Icon: X },
  neutral: {
    badge: "bg-surface-raised",
    icon: "text-text-secondary",
    Icon: SearchX,
  },
} as const;

interface ErrorCardProps {
  readonly title: string;
  readonly description?: string;
  /**
   * How alarming the card should look. `error` is the default and what every
   * `error.tsx` gets: something went wrong. `neutral` is for a page that is
   * merely absent — the 404 — where nothing broke and nothing should look as
   * though it did.
   */
  readonly tone?: keyof typeof tones;
  readonly action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Navigation out of the error, for boundaries that have nothing to retry —
   * `not-found.tsx` offers the way home rather than a retry button. Rendered
   * as a link, never as a `Button`, which is for actions only.
   */
  readonly link?: {
    label: string;
    href: string;
  };
}

/**
 * Full-width centered card for route boundaries: an icon badge, a title, an
 * optional description, and an optional retry action or link out. Render it
 * inside a `<PageLayout centered>`.
 */
export const ErrorCard = ({
  title,
  description,
  action,
  link,
  tone = "error",
}: ErrorCardProps) => {
  const { badge, icon, Icon } = tones[tone];

  return (
    <Card
      padding="lg"
      className="max-w-md w-full text-center space-y-6 mx-auto"
    >
      <div
        className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto",
          badge,
        )}
      >
        <Icon className={cn("w-8 h-8", icon)} aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <Text variant="h1" className="text-xl">
          {title}
        </Text>
        {description ? <Text variant="caption">{description}</Text> : null}
      </div>

      {action ? <Button onClick={action.onClick}>{action.label}</Button> : null}

      {link ? (
        <Link href={link.href} className={buttonVariants()}>
          {link.label}
        </Link>
      ) : null}
    </Card>
  );
};

export default ErrorCard;
