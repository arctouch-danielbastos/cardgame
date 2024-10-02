import type { Handler } from "framework/model/types";
import { produce } from "immer";

export default function composeHandlers<State extends object, Payload>(
  ...handlers: Handler<State, Payload>[]
): Handler<State, Payload> {
  return (state: State, payload: Payload) => {
    return handlers.reduce(
      (acc, fn) => produce(acc, draft => fn(draft as State, payload)),
      state
    );
  };
}
