export type Constructor<TClass = unknown, TArgs extends unknown[] = unknown[]> = new (...args: TArgs) => TClass;

export type ContextStore = Record<PropertyKey, unknown>;
