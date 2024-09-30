import { Constructor } from "../common/types";
import type ServiceLifetime from "./service-lifetime";

export type ServiceToken<T = unknown> = Constructor<T> | string | symbol;

export interface InjectableOptions<T = unknown> {
    serviceToken?: ServiceToken<T>;
    lifetime?: ServiceLifetime;
}
