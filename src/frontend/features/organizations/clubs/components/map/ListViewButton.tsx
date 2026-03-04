// src/frontend/features/organizations/clubs/components/map/ListViewButton.tsx
"use client";

import { FaList } from "react-icons/fa";

import { useRouter } from "@/navigation";
import { Button } from "@/shared/components/ui";

export function ListViewButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="md"
      onClick={() => router.push("/clubs")}
      className="inline-flex items-center gap-2"
    >
      <FaList className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  );
}

export default ListViewButton;
