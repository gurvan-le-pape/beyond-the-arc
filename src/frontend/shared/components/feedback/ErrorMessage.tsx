// src/frontend/shared/components/feedback/ErrorMessage.tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ message, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        <Text
          variant="body"
          as="p"
          role="alert"
          className="text-error-strong font-semibold"
        >
          {message}
        </Text>
      </div>
    );
  },
);

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;
