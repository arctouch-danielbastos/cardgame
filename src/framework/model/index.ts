import type {
  ModelConfig,
  Model,
  MoveConfig,
  ModelInitializer,
  ActionList,
  Action,
} from "framework/model/types";
import { produce } from "immer";
import createListener from "utils/createListener";

export default function buildModel<State extends object, Arg = void>({
  initState,
  afterEach,
  beforeEach,
}: ModelConfig<Arg, State>): ModelInitializer<Arg, State> {
  return (arg: Arg): Model<State> => {
    const listener = createListener();
    const globalHooks: ActionList<State> = {
      before: beforeEach ?? [],
      after: afterEach ?? [],
    };

    const hooks: { [id: number]: ActionList<State> } = {};

    let _state: State = initState(arg);
    let _error: Error | null = null;

    const play = ([moveId, handler]: MoveConfig<State>) => {
      const queue: Action<State>[] = [
        ...globalHooks.before,
        ...(hooks[moveId]?.before ?? []),
        handler,
        ...(hooks[moveId]?.after ?? []),
        ...globalHooks.after,
      ];

      try {
        let nextState = _state;
        for (const action of queue) {
          nextState = produce(nextState, draft => action(draft as State));
        }
        _state = nextState;
      } catch (err) {
        if (err instanceof Error) _error = err;
      }

      listener.emit();
    };

    return {
      get state() {
        return _state;
      },
      play,
      subscribe: listener.on,
      unsubscribe: listener.off,
    };
  };
}
