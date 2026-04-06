// src/backend/common/common.module.ts
import { Module } from "@nestjs/common";

import { CacheDedupService } from "./services/cache-dedup.service";

@Module({
  providers: [CacheDedupService],
  exports: [CacheDedupService],
})
export class CommonModule {}
