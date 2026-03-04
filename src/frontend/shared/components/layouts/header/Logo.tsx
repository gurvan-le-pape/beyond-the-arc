// src/frontend/shared/components/layouts/header/Logo.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Link } from "@/navigation";

export const Logo: React.FC = () => {
  const t = useTranslations("navigation");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark"
      ? "/BeyondTheArcLogo-dark.png"
      : "/BeyondTheArcLogo.png";

  return (
    <Link href="/" className="flex items-center group">
      <div className="relative h-16 w-auto overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105">
        <Image src={src} alt={t("logo.alt")} width={180} height={60} priority />
      </div>
    </Link>
  );
};
