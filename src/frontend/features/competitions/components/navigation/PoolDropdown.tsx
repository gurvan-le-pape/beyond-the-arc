// src/frontend/features/competitions/components/navigation/PoolDropdown.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/forms";

import type { Pool } from "../../pools/types/Pool";

interface PoolDropdownProps {
  readonly pools: Pool[];
  readonly selectedPoolId: number;
  readonly onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PoolDropdown({
  pools,
  selectedPoolId,
  onChange,
}: PoolDropdownProps) {
  const t = useTranslations("pool");

  return (
    <Select
      value={selectedPoolId?.toString() ?? ""}
      onChange={onChange}
      aria-label={t("label")}
    >
      {pools.map((pool) => (
        <option key={pool.id} value={pool.id}>
          {t("label")} {pool.letter}
        </option>
      ))}
    </Select>
  );
}

export default PoolDropdown;
