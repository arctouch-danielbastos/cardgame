import type {
  ModelConfig,
  Model,
  MoveConfig,
  Validator,
  Handler,
  StateInput,
  ModelInitializer,
  HookArgs,
  Hook,
} from "framework/model/types";
import addMethodListenerDecorator from "framework/model/addMethodListenerDecorator";
import { produce } from "immer";
import { memoize } from "lodash";
import createListener from "utils/createListener";
import ensureArray, { type MaybeArray } from "utils/ensureArray";

const validate = <State extends object, Payload>(
  state: State,
  payload: Payload,
  validators: Array<Validator<State, Payload>>
) => {
  try {
    for (const validate of validators) {
      validate(state, payload);
    }
    return true;
  } catch (err) {
    return false;
  }
};

const handleHook = <State extends object>(
  hooks: MaybeArray<Hook<State>>,
  state: State
) => {
  let result = state;
  for (const config of ensureArray(hooks)) {
    const hook = typeof config === "function" ? { handler: config } : config;
    if (hook.condition?.(result) === false) continue;
    result = produce(result, draft => hook.handler(draft as State));
  }
  return result;
};

const handleMove = <State extends object, Payload>(
  state: State,
  payload: Payload,
  handler: Handler<State, Payload>
) => {
  return produce(state, draft => handler(draft as State, payload));
};

export default function buildModel<State extends object, Arg = void>({
  state: initState,
  afterEach,
}: ModelConfig<Arg, State>): ModelInitializer<Arg, State> {
  return (arg: Arg): Model<State> => {
    const listener = createListener<HookArgs<State>>();

    let _state: State;
    const history: State[] = [];

    const buildNewState = memoize(state =>
      addMethodListenerDecorator(state, listener)
    );

    const stateInput: StateInput<State> = {
      set(changes) {
        _state = buildNewState({
          ..._state,
          ...(typeof changes === "function" ? changes(_state) : changes),
        });
      },
      move: <Payload>(config: MoveConfig<State, Payload>) => {
        return (payload: Payload) => {
          const move: MoveConfig<State, Payload> =
            typeof config === "function" ? { handler: config } : config;

          const validations = ensureArray(move.validations ?? []);
          if (!validate(_state, payload, validations)) return;
          history.push(_state);

          let state = handleMove(_state, payload, move.handler);
          if (afterEach) state = handleHook(afterEach, state);

          stateInput.set(state);
        };
      },
    };

    _state = buildNewState(initState(stateInput, arg));

    return {
      get state() {
        return _state;
      },
      undo() {
        const previousState = history.pop();
        if (!previousState) return;
        _state = previousState;
        // @ts-expect-error I'll improve this mechanism here
        listener.emit();
      },
      subscribe: listener.on,
      unsubscribe: listener.off,
    };
  };
}
