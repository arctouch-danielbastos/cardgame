export type Action<State extends object> = (state: State) => void;
export type MoveId = string;

export interface Move<State extends object, Payload> {
  (payload: Payload): [MoveId, Action<State>];
  id: string;
  isValid: (state: State, payload: Payload) => boolean;
}

export type MoveConfig<State extends object> = [moveId: number, Action<State>];

export type ActionList<State extends object> = {
  before: Array<Action<State>>;
  after: Array<Action<State>>;
};

export type ModelConfig<Param, State extends object> = {
  initState: (param: Param) => State;
  plugins: Array<(api: PluginApi<State>) => void>;
  afterEach?: Array<Action<State>>;
  beforeEach?: Array<Action<State>>;
};

export type PluginApi<State extends object> = {
  before: (moveId: MoveId, action: Action<State>) => void;
  beforeEach: (action: Action<State>) => void;
  after: (moveId: MoveId, action: Action<State>) => void;
  afterEach: (action: Action<State>) => void;
};

export type ModelInitializer<Param, State extends object> = (
  para: Param
) => Model<State>;

type Callback<T = void> = (param: T) => void;

export type Model<State extends object> = {
  state: State;
  play: (args: [moveId: MoveId, handler: Action<State>]) => void;
  subscribe: (cb: Callback<void>) => void;
  unsubscribe: (cb: Callback<void>) => void;
};
