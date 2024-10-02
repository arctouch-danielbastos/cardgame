import { isFunction, forOwn } from "lodash";
import type { AnyFunction, MethodParams } from "utils/types";

export default function wrapObjectMethods<State extends object>(
  state: State,
  callback: <K extends keyof State>(
    key: K,
    config: State[K] extends AnyFunction ? State[K] : never,
    payload: State[K] extends (arg: infer Payload) => void ? Payload : never
  ) => void
) {
  const _state = {} as State;

  forOwn(state, (value, _key) => {
    const key = _key as keyof State;

    if (isFunction(value)) {
      _state[key] = function (arg: MethodParams<State>) {
        // @ts-expect-error TS can't guarantee args length
        callback(key, value, arg);
      } as State[typeof key];
    } else {
      _state[key] = value;
    }
  });

  return _state;
}
