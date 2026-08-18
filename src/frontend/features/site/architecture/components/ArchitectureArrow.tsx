// src/frontend/features/site/architecture/components/ArchitectureArrow.tsx
/**
 * The connector between two nodes of the architecture diagram.
 *
 * **Disappears below `md`.** The diagram reflows to a vertical stack on narrow
 * screens, where a rightward arrow would point at nothing — so the connection
 * is implied by order rather than drawn. Purely decorative either way.
 */
export function ArchitectureArrow() {
  return (
    <div className="hidden md:block text-text-muted">
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
