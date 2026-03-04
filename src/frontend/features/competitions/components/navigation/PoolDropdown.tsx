// src/frontend/features/competitions/components/navigation/PoolDropdown.tsx
import { useTranslations } from "next-intl";

import { Select } from "@/shared/components/ui";

import type { Pool } from "../../pools/types/Pool";

interface PoolDropdownProps {
  pools: Pool[];
  selectedPoolId: number | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
      {/* Placeholder option */}
      <option value="" disabled>
        {t("noPools")}
      </option>

      {/* Pool options */}
      {pools.length > 0 ? (
        pools.map((pool) => (
          <option key={pool.id} value={pool.id}>
            {t("label")} {pool.letter}
          </option>
        ))
      ) : (
        <option value="" disabled>
          {t("noAvailable")}
        </option>
      )}
    </Select>
  );
}

export default PoolDropdown;
