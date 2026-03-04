// src/frontend/shared/types/axios.d.ts
import "axios";

declare module "axios" {
  export interface AxiosResponse<T = any> {
    meta?: {
      count?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  }
}
