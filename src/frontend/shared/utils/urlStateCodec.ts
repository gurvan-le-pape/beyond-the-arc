// src/frontend/shared/utils/urlStateCodec.ts

/**
 * How one piece of page state is written to and read from a query parameter.
 * `parse` returns `undefined` for a value it does not accept, so a hand-edited
 * or stale URL falls back to "not set" rather than to a broken filter.
 */
export interface UrlCodec<T> {
  readonly parse: (raw: string) => T | undefined;
  readonly serialize: (value: T) => string;
}

/** Free text, e.g. a name search. The empty string means "not set". */
export const textParam: UrlCodec<string> = {
  parse: (raw) => (raw === "" ? undefined : raw),
  serialize: (value) => value,
};

/** A positive integer: an id, a number, a page. */
export const intParam: UrlCodec<number> = {
  parse: (raw) => {
    if (!/^\d+$/.test(raw)) return undefined;
    const value = Number(raw);
    return value >= 1 ? value : undefined;
  },
  serialize: String,
};

/** A calendar day as YYYY-MM-DD, the value of an `<input type="date">`. */
export const dateParam: UrlCodec<string> = {
  parse: (raw) => (/^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : undefined),
  serialize: (value) => value,
};

/**
 * One of a closed set of strings, e.g. a category or a level.
 *
 * @param values - The accepted values
 * @returns A codec that parses only those values
 */
export function enumParam<T extends string>(values: readonly T[]): UrlCodec<T> {
  return {
    parse: (raw) =>
      (values as readonly string[]).includes(raw) ? (raw as T) : undefined,
    serialize: (value) => value,
  };
}

export type UrlCodecs<T> = {
  readonly [K in keyof T]-?: UrlCodec<NonNullable<T[K]>>;
};

/**
 * Reads every coded key out of the query string. Keys that are absent or that
 * their codec rejects come back `undefined`.
 *
 * @param params - The current query string
 * @param codecs - One codec per state key; the key is also the parameter name
 * @returns The decoded state
 */
export function decodeUrlState<T>(
  params: URLSearchParams,
  codecs: UrlCodecs<T>,
): { [K in keyof T]: T[K] | undefined } {
  const state = {} as { [K in keyof T]: T[K] | undefined };
  for (const key of Object.keys(codecs) as (keyof T)[]) {
    const raw = params.get(String(key));
    state[key] =
      raw === null ? undefined : (codecs[key].parse(raw) as T[typeof key]);
  }
  return state;
}

/**
 * Writes a partial update into a copy of the query string: a value is
 * serialized, `undefined` or an empty serialization removes the parameter, and
 * keys outside the update are left as they are.
 *
 * @param params - The query string to start from (not modified)
 * @param codecs - One codec per state key
 * @param patch - The keys to change
 * @returns The new query string
 */
export function encodeUrlState<T>(
  params: URLSearchParams,
  codecs: UrlCodecs<T>,
  patch: Partial<{ [K in keyof T]: T[K] | undefined }>,
): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    const serialized =
      value === undefined || value === null
        ? ""
        : codecs[key].serialize(value as NonNullable<T[typeof key]>);
    if (serialized === "") next.delete(String(key));
    else next.set(String(key), serialized);
  }
  return next;
}
