import type { HookArgs } from "framework/model/types";
import wrapObjectMethods from "framework/model/wrapObjectMethods";
import type { Listener } from "utils/createListener";

export default function addMethodListenerDecorator<State extends object>(
  state: State,
  listener: Listener<HookArgs<State>>
) {
  return wrapObjectMethods(state, (key, fn, arg) => {
    fn(arg);
    // @ts-expect-error Hard to type
    listener.emit({ key, payload: arg });
  });
}
