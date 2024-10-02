import { isArray } from "lodash";

export type MaybeArray<T> = T | T[];
export default function ensureArray<T>(array: MaybeArray<T>): T[] {
  return isArray(array) ? array : [array];
}
