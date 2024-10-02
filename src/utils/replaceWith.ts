import { isEqual, map } from "lodash";

export default function replaceWith<T>(list: T[], item: T, replacement: T) {
  return map(list, i => (isEqual(i, item) ? replacement : i));
}
