// src/frontend/shared/components/feedback/ErrorMessage.tsx
import { type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const ErrorMessage = ({
  message,
  className,
  ref,
  ...props
}: ErrorMessageProps) => {
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
};

export default ErrorMessage;
