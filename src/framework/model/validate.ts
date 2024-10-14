import type { Test } from "framework/model/move";

export function validate<State extends object, Payload = void>(
  message: string,
  test: (state: State, payload: Payload) => boolean
): Test<State, Payload> {
  return { message, test };
}

export function validatePayload<Payload>(
  message: string,
  test: (payload: Payload) => boolean
) {
  return { message, test: (_: unknown, payload: Payload) => test(payload) };
}
