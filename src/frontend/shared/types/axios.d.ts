// src/frontend/shared/types/axios.d.ts
import "axios";

declare module "axios" {
  // Merging into axios's own interface: the type parameter has to be named
  // and defaulted exactly as axios declares it, used or not.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface AxiosResponse<T = any> {
    meta?: {
      count?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  }
}
