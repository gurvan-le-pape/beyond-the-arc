// src/backend/common/pipes/parse-optional-int.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform {
  transform(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) throw new BadRequestException("Invalid number");
    return parsed;
  }
}
