// src/frontend/vitest.setup.ts
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library unmounts after each test by itself only when the runner
// exposes a global `afterEach`; Vitest does not unless `globals` is on.
afterEach(cleanup);
