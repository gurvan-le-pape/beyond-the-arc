// src/frontend/shared/components/ui/feedback/ErrorMessage.tsx
import { useTranslations } from "next-intl";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-red-500 text-lg font-semibold">
        {t("error")}: {message}
      </p>
    </div>
  );
}

export default ErrorMessage;
