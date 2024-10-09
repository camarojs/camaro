import type Context from "./context";

export type ComposedMiddleware = (context: Context, next?: Next) => Promise<void>;

export type Middleware = (context: Context, next: Next) => Promise<void> | void;

export type Next = () => Promise<void> | void;
