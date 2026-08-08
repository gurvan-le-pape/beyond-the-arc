// src/backend/common/pipes/parse-entity-id.pipe.ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
} from "@nestjs/common";

/**
 * PostgreSQL `int4` bounds. Every `@id` in `schema.prisma` is a Prisma `Int`,
 * which maps to `int4` — so an id outside this range cannot identify a row and
 * has nothing to look up.
 */
const MIN_ENTITY_ID = -2_147_483_648;
const MAX_ENTITY_ID = 2_147_483_647;

/**
 * `ParseIntPipe` with the range check it does not do.
 *
 * Nest's own guard is `/^-?\d+$/` plus `isFinite`, neither of which has an
 * upper bound, so `2147483648` parses cleanly and reaches Prisma. Postgres then
 * rejects it with `22003` and Prisma raises `ValueOutOfRange`, which no service
 * catches — turning a client mistake into a 500 and a Sentry event on a public,
 * unauthenticated GET. Rejecting it here keeps it a 400, alongside the 400 that
 * a non-numeric id already gets.
 */
@Injectable()
export class ParseEntityIdPipe extends ParseIntPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const id = await super.transform(value, metadata);

    if (id < MIN_ENTITY_ID || id > MAX_ENTITY_ID) {
      // Names the parameter but not the value: the message is logged and
      // shipped to Sentry, and the caller controls how long the value is.
      throw new BadRequestException(
        `Route parameter "${metadata.data}" is outside the supported id range`,
      );
    }

    return id;
  }
}
