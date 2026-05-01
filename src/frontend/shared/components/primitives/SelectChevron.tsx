// src/frontend/shared/components/primitives/SelectChevron.tsx

export function SelectChevron({
  open,
  className = "",
}: {
  readonly open?: boolean;
  readonly className?: string;
}) {
  return (
    <svg
      className={`w-3.5 h-3.5 flex-shrink-0 text-text-muted dark:text-text-muted-dark transition-transform duration-200 ${
        open ? "rotate-180" : ""
      } ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 9-7 7-7-7"
      />
    </svg>
  );
}
