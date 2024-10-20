import ServiceLifetime from "../common/di/service-lifetime";
import { Constructor, ServiceToken } from "../common/types";
import Context from "./http/context";

export type ComposedMiddleware = (context: Context, next?: Next) => Promise<void>;
export type Middleware = (context: Context, next: Next) => Promise<void> | void;
export type Next = () => Promise<void> | void;

export interface InjectableOptions<T = unknown> {
    serviceToken?: ServiceToken<T>;
    lifetime?: ServiceLifetime;
}

export interface ControllerMetadata {
    path: string;
    target: Constructor;
}
