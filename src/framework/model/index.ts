import type {
  ModelConfig,
  Model,
  MoveConfig,
  ModelInitializer,
  ActionList,
  Action,
  MoveId,
  PluginApi,
} from "framework/model/types";
import { produce } from "immer";
import createListener from "utils/createListener";

export default function buildModel<State extends object, Arg = void>({
  initState,
  afterEach,
  beforeEach,
  plugins,
}: ModelConfig<Arg, State>): ModelInitializer<Arg, State> {
  return (arg: Arg): Model<State> => {
    const listener = createListener();

    let state: State = initState(arg);
    let error: Error | null = null;

    const hooks: { [id in MoveId]: ActionList<State> } = {};
    const globalHooks: ActionList<State> = {
      before: beforeEach ?? [],
      after: afterEach ?? [],
    };

    const api: PluginApi<State> = {
      beforeEach: action => globalHooks.before.push(action),
      before(moveId, action) {
        if (!(moveId in hooks)) hooks[moveId] = { before: [], after: [] };
        hooks[moveId].before.push(action);
      },

      afterEach: action => globalHooks.after.push(action),
      after(moveId, action) {
        if (!(moveId in hooks)) hooks[moveId] = { before: [], after: [] };
        hooks[moveId].after.push(action);
      },
    };

    plugins.forEach(fn => fn(api));

    const play = ([moveId, handler]: MoveConfig<State>) => {
      const queue: Action<State>[] = [
        ...globalHooks.before,
        ...(hooks[moveId]?.before ?? []),
        handler,
        ...(hooks[moveId]?.after ?? []),
        ...globalHooks.after,
      ];

      try {
        let nextState = state;

        for (const action of queue) {
          nextState = produce(nextState, draft => action(draft as State));
        }

        state = nextState;
      } catch (err) {
        if (err instanceof Error) error = err;
      }

      listener.emit();
    };

    return {
      get state() {
        return state;
      },
      get error() {
        return error;
      },
      play,
      subscribe: listener.on,
      unsubscribe: listener.off,
    };
  };
}
