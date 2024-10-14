import type { Action } from "framework/model/types";

type Config<State extends object> = {
  condition: (state: State) => boolean;
  handler: (state: State) => void;
};

export default function buildHook<State extends object>({
  condition,
  handler,
}: Config<State>): Action<State> {
  return (state: State) => {
    if (!condition(state)) return;
    handler(state);
  };
}
