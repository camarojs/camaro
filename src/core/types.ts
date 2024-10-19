import ServiceLifetime from "../common/di/service-lifetime";
import { ServiceToken } from "../common/types";
import Context from "./http/context";

export type ComposedMiddleware = (context: Context, next?: Next) => Promise<void>;
export interface InjectableOptions<T = unknown> {
    serviceToken?: ServiceToken<T>;
    lifetime?: ServiceLifetime;
}
export type Middleware = (context: Context, next: Next) => Promise<void> | void;
export type Next = () => Promise<void> | void;
