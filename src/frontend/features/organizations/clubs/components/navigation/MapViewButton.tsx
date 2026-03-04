// src/frontend/features/organizations/clubs/components/navigation/MapViewButton.tsx
"use client";

import { FaMap } from "react-icons/fa";

import { useRouter } from "@/navigation";
import { Button } from "@/shared/components/ui";

export function MapViewButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <div className="mb-6 flex justify-end">
      <Button
        variant="outline"
        size="md"
        onClick={() => router.push("/clubs/map")}
        className="inline-flex items-center gap-2"
      >
        <FaMap className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </Button>
    </div>
  );
}

export default MapViewButton;
