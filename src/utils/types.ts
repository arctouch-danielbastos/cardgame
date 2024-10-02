export type AnyFunction = (...args: any[]) => any;

export type MethodParams<T extends object> = {
  [K in keyof T]: T[K] extends AnyFunction ? Parameters<T[K]> : never;
}[keyof T];

export type MethodNames<T extends object> = {
  [K in keyof T]: T[K] extends AnyFunction ? K : never;
}[keyof T];

export type Methods<T extends object> = {
  [K in keyof T]: T[K] extends AnyFunction ? T[K] : never;
}[keyof T];

export type NonMethods<T extends object> = Omit<T, MethodNames<T>>;
