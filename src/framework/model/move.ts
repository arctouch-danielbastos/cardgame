import { nanoid } from "nanoid";

export type Test<State extends object, Payload> = {
  message: string;
  test: (state: State, payload: Payload) => boolean;
};

type Config<State extends object, Payload> = {
  validations?: Test<State, Payload>[];
  handler: (state: State, payload: Payload) => void;
};

export default function move<State extends object, Payload>({
  validations = [],
  handler,
}: Config<State, Payload>) {
  const moveId = nanoid(10);

  const moveFn = (payload: Payload) => {
    const action = (state: State) => {
      for (const { test, message } of validations) {
        if (!test(state, payload)) throw new Error(message);
      }

      handler(state, payload);
    };
    return [moveId, action];
  };
  moveFn.id = moveId;

  return moveFn;
}
