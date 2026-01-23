import { type Class } from "type-fest";

export type ComposedMiddleware = (context: Context, next?: Next) => Promise<void>;

// TODO: refine Context type
export type Context = Record<string, unknown>;

export type Handler = (ctx: Context) => Promise<void> | void;

export type Middleware = (ctx: Context, next: Next) => Promise<void> | void;

export type Next = () => Promise<void> | void;

export const ServiceLifetime = {
    Transient: 0,
    Scoped: 1,
    Singleton: 2,
} as const;

export const ServiceLifetimeNames = {
    [ServiceLifetime.Transient]: "Transient",
    [ServiceLifetime.Scoped]: "Scoped",
    [ServiceLifetime.Singleton]: "Singleton",
} as const;

export type ServiceLifetime = typeof ServiceLifetime[keyof typeof ServiceLifetime];

export type ServiceToken<T = unknown> = Class<T> | string | symbol;
