// src/frontend/features/organizations/utils/departmentShapes.ts
import { FRANCE_DEPARTMENTS } from "@/features/geography/constants";

import { normalizeDepartmentCode } from "./normalizeDepartmentCode";

/**
 * The department shapes keyed the way committees show their department:
 * the shapes carry INSEE codes ("01"), committees "1".
 */
export const DEPARTMENT_SHAPES = FRANCE_DEPARTMENTS.map((shape) => ({
  ...shape,
  code: normalizeDepartmentCode(shape.code),
}));
