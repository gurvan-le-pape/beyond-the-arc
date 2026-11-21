// src/frontend/features/site/docs/components/docs-chapters/CodeBlock.tsx

interface CodeBlockProps {
  /** The code, with its own line breaks; shown verbatim. */
  readonly children: string;
}

/**
 * A block of code or terminal output, kept on its lines and scrolled
 * sideways rather than wrapped.
 *
 * Dark in every theme, from raw colours rather than surface tokens: a code
 * sample reads the same whichever theme the page is in.
 */
export function CodeBlock({ children }: Readonly<CodeBlockProps>) {
  return (
    <pre className="overflow-x-auto rounded-button bg-gray-900 p-6 text-sm text-gray-100">
      {children}
    </pre>
  );
}
