import type { Move, PluginApi } from "framework/model/types";
import type { MaybeArray } from "utils/ensureArray";
import ensureArray from "utils/ensureArray";

export type Result = "won" | "lost" | null;
type ResultKey<State extends object> = {
  [K in keyof State]: State[K] extends Result ? K : never;
}[keyof State];

type Config<State extends object> = {
  hasWon: (state: State) => boolean;
  hasLost: (state: State) => boolean;
  onTie: Result;
  checkAfter: "all" | MaybeArray<Move<State, unknown>>;
  key: ResultKey<State>;
};

export default function buildResultPlugin<State extends object>(
  config: Config<State>
) {
  const action = (state: State) => {
    const hasWon = config.hasWon(state);
    const hasLost = config.hasLost(state);

    // @ts-expect-error Too hard to type
    if (hasWon && hasLost) state[config.key] = config.onTie;
    // @ts-expect-error Too hard to type
    else if (hasWon) state[config.key] = "won";
    // @ts-expect-error Too hard to type
    else if (hasLost) state[config.key] = "lost";
  };

  const hook = (state: State) => {
    if (state[config.key]) {
      throw new Error("Can't play a game after it finishes");
    }
  };

  return (api: PluginApi<State>) => {
    api.beforeEach(hook);

    if (config.checkAfter === "all") api.afterEach(action);
    else {
      for (const move of ensureArray(config.checkAfter)) {
        api.after(move.id, action);
      }
    }
  };
}
