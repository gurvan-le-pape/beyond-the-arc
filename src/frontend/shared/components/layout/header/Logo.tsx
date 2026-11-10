// src/frontend/shared/components/layout/header/Logo.tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

/**
 * The mark for each theme. Both are rendered and CSS shows the one that suits
 * the theme class, so the server's HTML is already right and nothing waits for
 * the client to learn the theme. Literal class strings, so Tailwind sees the
 * arbitrary high-contrast variant; high contrast's ground is black, so it takes
 * the dark mark.
 */
const MARKS = [
  {
    src: "/BeyondTheArcMark.png",
    className: "block dark:hidden [.high-contrast_&]:hidden",
  },
  {
    src: "/BeyondTheArcMark-dark.png",
    className: "hidden dark:block [.high-contrast_&]:block",
  },
] as const;

/**
 * The site's name, linking home: the ball-and-arc mark beside the name set in
 * text, which stays legible at header size where the name inside the full logo
 * image does not. The mark is decorative, so the link is named by the text.
 *
 * **Between `md` and `lg` the name is visually hidden, not removed.** The
 * desktop header switches on at `md`, and below `lg` the mark, the four
 * section links and the controls leave no room for it: it would wrap and spill
 * out of the capsule. `sr-only` keeps it as the link's accessible name.
 */
export function Logo() {
  const t = useTranslations("navigation");

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-button focus-ring group"
    >
      {MARKS.map((mark) => (
        <Image
          key={mark.src}
          src={mark.src}
          alt=""
          width={55}
          height={24}
          priority
          className={`${mark.className} transition-transform duration-300 group-hover:scale-105`}
        />
      ))}
      <span className="whitespace-nowrap text-lg font-extrabold tracking-tight text-text-heading md:max-lg:sr-only">
        {t("footer.projectName")}
      </span>
    </Link>
  );
}
