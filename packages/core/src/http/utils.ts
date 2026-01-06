import { ComposedMiddleware, Context, Middleware, Next } from "../types.js";

/**
 * Composes multiple middleware functions into a single middleware function.
 * Middlewares are executed in the order they are provided.
 *
 * @param middlewares - Array of middleware functions to compose
 * @returns A composed middleware function that executes all middlewares in sequence
 *
 * @example
 * ```ts
 * const combined = compose(middleware1, middleware2, middleware3);
 * await combined(context);
 * ```
 */
export const compose = (...middlewares: Middleware[]): ComposedMiddleware => {
    for (const fn of middlewares) {
        if (typeof fn !== "function") {
            throw new TypeError("Middleware must be a function!");
        }
    }

    return async (context: Context, next?: Next) => {
        let lastCalledIndex = -1;

        const dispatch = async (index: number): Promise<void> => {
            if (index <= lastCalledIndex) {
                throw new Error("next() called multiple times.");
            }

            lastCalledIndex = index;

            const currentMiddleware = index === middlewares.length ? next : middlewares[index];
            return await currentMiddleware?.(context, dispatch.bind(null, index + 1));
        };

        return dispatch(0);
    };
};
