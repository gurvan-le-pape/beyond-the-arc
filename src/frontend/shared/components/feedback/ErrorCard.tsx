// src/frontend/shared/components/feedback/ErrorCard.tsx
import { Button } from "../primitives/Button";
import { Text } from "../typography";

interface ErrorCardProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Full-width centered error card for error boundaries: an error icon badge, a
 * title, an optional description, and an optional retry action. Render it
 * inside a `<PageLayout centered>`.
 */
export const ErrorCard = ({ title, description, action }: ErrorCardProps) => {
  return (
    <div className="bg-surface-subtle rounded-card border border-divide shadow-card p-10 max-w-md w-full text-center space-y-6 mx-auto">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-subtle mx-auto">
        <svg
          className="w-8 h-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <Text variant="h1" className="text-xl">
          {title}
        </Text>
        {description ? <Text variant="caption">{description}</Text> : null}
      </div>

      {action ? <Button onClick={action.onClick}>{action.label}</Button> : null}
    </div>
  );
};

export default ErrorCard;
