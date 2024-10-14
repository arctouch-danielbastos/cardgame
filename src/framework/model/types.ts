export type Action<State extends object> = (state: State) => void;

export type MoveConfig<State extends object> = [moveId: number, Action<State>];

export type ActionList<State extends object> = {
  before: Array<Action<State>>;
  after: Array<Action<State>>;
};

export type ModelConfig<Param, State extends object> = {
  initState: (param: Param) => State;
  afterEach?: Array<Action<State>>;
  beforeEach?: Array<Action<State>>;
};

export type ModelInitializer<Param, State extends object> = (
  para: Param
) => Model<State>;

type Callback<T = void> = (param: T) => void;

export type Model<State extends object> = {
  state: State;
  play: (args: [moveId: number, handler: Action<State>]) => void;
  subscribe: (cb: Callback<void>) => void;
  unsubscribe: (cb: Callback<void>) => void;
};
