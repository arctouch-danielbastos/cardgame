import { findLast, isNull, negate } from "lodash";

export const lastValid = <T>(list: Array<T | null>) =>
  findLast(list, negate(isNull));
