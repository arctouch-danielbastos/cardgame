export type Listener<T = void> = ReturnType<typeof createListener<T>>;
type Callback<T> = (params: T) => void;

export default function createListener<T = void>() {
  let listeners: Callback<T>[] = [];
  return {
    on: (cb: Callback<T>) => {
      listeners.push(cb);
    },
    off: (cb: Callback<T>) => {
      listeners = listeners.filter(it => it !== cb);
    },
    emit: (param: T) => listeners.forEach(cb => cb(param)),
  };
}
