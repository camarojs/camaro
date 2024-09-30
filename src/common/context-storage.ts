import { AsyncLocalStorage } from "node:async_hooks";
import { ContextStore } from "./types";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ContextStorage {
    static #als = new AsyncLocalStorage<ContextStore>();

    static run<TReturn>(store: ContextStore, callback: () => TReturn): TReturn;
    static run<TReturn, TArgs extends unknown[]>(
        store: ContextStore, callback: (...args: TArgs) => TReturn, ...args: TArgs): TReturn;
    static run<TReturn>(store: ContextStore, callback: (...args: unknown[]) => TReturn, ...args: unknown[]) {
        return this.#als.run(store, callback, ...args);
    }

    static get(): ContextStore | undefined;
    static get(key: PropertyKey): unknown;
    static get(key?: PropertyKey) {
        const store = this.#als.getStore();

        if (key) {
            return store?.[key];
        }

        return store;
    }

    static set(key: PropertyKey, value: unknown) {
        const store = this.#als.getStore();

        if (store) {
            store[key] = value;
        }
    }
}
