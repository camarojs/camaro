import { Class } from "type-fest";

export enum ServiceLifetime {
    Transient = 0,
    Scoped = 1,
    Singleton = 2,
}

export type ServiceToken<T = unknown> = Class<T> | string | symbol;
