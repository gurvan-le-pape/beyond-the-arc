// src/frontend/shared/components/ui/feedback/ErrorMessage.tsx
interface ErrorMessageProps {
  readonly message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p
        role="alert"
        className="text-error dark:text-error-light text-lg font-semibold"
      >
        {message}
      </p>
    </div>
  );
}

export default ErrorMessage;
