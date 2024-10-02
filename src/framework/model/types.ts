import type { MaybeArray } from "utils/ensureArray";

export type Validator<State extends object, Payload> = (
  state: State,
  move: Payload
) => void;

export type Handler<State extends object, Payload> = (
  state: State,
  move: Payload
) => void;

export type MoveConfig<State extends object, Payload> =
  | Handler<State, Payload>
  | {
      validations?: MaybeArray<Validator<State, Payload>>;
      handler: Handler<State, Payload>;
    };

export type StateChange<State> =
  | Partial<State>
  | ((state: State) => Partial<State>);

export type StateInput<State extends object> = {
  set: (changes: StateChange<State>) => void;
  move: <Payload = void>(
    config: MoveConfig<State, Payload> | Handler<State, Payload>
  ) => (payload: Payload) => void;
};

export type Hook<State extends object> =
  | ((state: State) => void)
  | {
      handler: (state: State) => void;
      condition?: (state: State) => boolean;
    };

export type ModelConfig<Param, State extends object> = {
  state: (api: StateInput<State>, param: Param) => State;
  afterEach?: MaybeArray<Hook<State>>;
};

export type ModelInitializer<Param, State extends object> = (
  para: Param
) => Model<State>;

export type HookArgs<State extends object> = {
  [K in keyof State]: State[K] extends (payload: infer Payload) => void
    ? { action: K; payload: Payload }
    : never;
}[keyof State];

type Callback<T = void> = (param: T) => void;
export type Model<State extends object> = {
  state: State;
  undo: () => void;
  subscribe: (cb: Callback<HookArgs<State>>) => void;
  unsubscribe: (cb: Callback<HookArgs<State>>) => void;
};
